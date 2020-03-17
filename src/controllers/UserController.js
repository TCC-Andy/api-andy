const mongoose = require("mongoose");
const validator = require("email-validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Usuario = mongoose.model("Usuario");
const emailService = require('../services/emailService');
var dateFormat = require('dateformat');
const authConfig = require('../config/auth');
const jwt = require('jsonwebtoken');

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 15,
    });
}

module.exports = {
    async showUsers(req, res) {
        const usuarios = await Usuario.find();
        return res.json(usuarios);
    },

    async show(req, res) {
        try {
            const usuario = await Usuario.findById(req.params.id);
            return res.json(usuario);
        } catch (err) {
            console.log(err)
            return res.json({

                status: 400,
                menssagem: 'Erro em buscar usuario',
            });
        }
    },

    async createUser(req, res) {

        try {
            const { nome, sobrenome, email, senha } = req.body;

            if ((!nome) || (!sobrenome) || (!email) || (!senha)) {
                return res.json({
                    status: 406,
                    menssagem: 'Todos os campos precisam ser preenchidos',
                })
            }
            //@ e . depois somente
            if (!validator.validate(email)) {
                return res.json({
                    status: 406,
                    menssagem: 'Formato do email não é valido',
                })

            }
            if (await Usuario.findOne({ email })) {
                return res.json({
                    status: 412,
                    menssagem: 'Usuario ja existe',
                })
            }

            usr = req.body;
            // mydate = new Date();
            /*  usr.Date= dateFormat(now,"dd/mm/yyyy HH:MM:ss UTC").split(' ');*/
            /*  usr.criadoEm = mydate;*/

            const usuario = await Usuario.create(usr);
            emailService.send(1, req.body.email, req.body.nome);

            //Não voltar senha
            usuario.senha = undefined;
            return res.json({
                status: 200,
                menssagem: 'Cadastrado com sucesso',
                usuario
            });
        } catch (err) {
            return res.json({
                status: 500,
                menssagem: 'Erro no registro do usuario',
                error: err

            });
        }

    },

    async authenticate(req, res) {
        const { email, senha } = req.body;

        const usuario = await Usuario.findOne({ email }).select('+senha');

        //Verificar se caso não encontrar o email retornar ou não a mensagem abaixo
        /*
                if (!usuario) {
                    return res.json({
                        status: 400,
                        menssagem: 'Usuario não encontrado',
        
                    });
                }
        */

        if ((!usuario) || (!bcrypt.compareSync(senha, usuario.senha))) {
            return res.json({
                status: 400,
                menssagem: 'Email e/ou senha incorreto(s)',

            });
        };

        return res.json({
            status: 200,
            menssagem: 'Usuario encontrado',
            usuario,
            token: generateToken({
                id: usuario.id
            })
        });

    },

    async sendEmailToken(req, res) {
        const { email, nome } = req.body;

        try {
            const user = await Usuario.findOne({ email });
            if (!user) {
                return res.json({
                    status: 400,
                    menssagem: 'Usuario não encontrado',
                });
            }
            const token = crypto.randomBytes(20).toString('hex');
            const now = new Date();
            now.setHours(now.getHours() + 1);

            await Usuario.findByIdAndUpdate(user.id, {
                '$set': {
                    pwdToken: token,
                    pwdExpires: now,
                }
            });

            emailService.send(2, req.body.email, req.body.nome, token, user.get("_id").toString());

            return res.json({

                status: 200,
                menssagem: 'Email enviado',
            });

        } catch (err) {
            console.log(err)
            return res.json({

                status: 400,
                menssagem: 'Erro em recuperar o email',
            });
        }
    },


    async verifyToken(req, res) {
        const authHeader = req.headers.authorization;
        const id = req.params.id;
        const user = await Usuario.findById({ _id: id });

        if (!authHeader) {
            return res.json({
                status: 403,
                error: 'Token não fornecido.'
            });
        }
        const parts = authHeader.split(' ');
        if (parts.length < 2) {
            return res.json({
                status: 403,
                error: 'Token com erro.'
            });
        }
        const [scheme, token] = parts;
        if (!/^Bearer$/i.test(scheme)) {
            return res.json({
                status: 403,
                error: 'Token malformado.'
            });
        }
        await jwt.verify(token, authConfig.secret, (err, decoded) => {
            if (!err) {
                return res.json({
                    status: 200,
                    user,
                    menssagem: 'Token valido',
                });
            } else {
                return res.json({
                    status: 401,
                    error: err
                });
            }
        });
    },

    async updatePassword(req, res) {
        //Verificar novamente o token e o tempo
        //Obs: Codigo duplicado, refatorar depois

        try {
            const { email, token: currentToken, senha } = req.body;
            const usuario = await Usuario.findOne({ email }).select('+ pwdToken  pwdExpires');

            if (!usuario) {
                return res.json({
                    status: 400,
                    menssagem: 'Usuario não encontrado',
                });
            }
            const now = new Date();
            if ((currentToken !== usuario.pwdToken) || (now > usuario.pwdExpires)) {
                return res.json({
                    status: 400,
                    menssagem: 'Token invalido',

                });
            }

            await Usuario.findOne({ email }, function (err, usr) {
                usr.senha = senha;
                usr.pwdToken = undefined;
                usr.pwdExpires = undefined;

                usr.save(function (err) {
                    if (err) {
                        return res.json({
                            status: 500,
                            menssagem: 'Erro ao salvar senha',
                            usuario,
                        });
                    }
                });
            });
            return res.json({
                status: 200,
                menssagem: 'Senha atualizada',
            });


        } catch (err) {
            console.log(err)
            return res.json({

                status: 400,
                menssagem: 'Erro em atualizar a senha',
                error: err
            });
        }


    },

    /*Implementar */
    async update(req, res) {
        const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true, useFindAndModify: false });
        return res.json(usuario);
    },

    /*Implementar */
    async destroy(req, res) {
        await Usuario.findByIdAndRemove(req.params.id);
        return res.send();
    }

};