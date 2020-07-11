const mongoose = require("mongoose");
const validator = require("email-validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Usuario = mongoose.model("Usuario");
const emailService = require('../services/emailService');
var dateFormat = require('dateformat');
const authConfig = require('../config/auth');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const tz = require("moment-timezone")
const Funcionario = mongoose.model("Funcionario");
const Servico = mongoose.model("Servicos");
const Agenda = mongoose.model("Agendas");
const Favoritos = mongoose.model("Favoritos");
const empresa = mongoose.model("Empresas");


function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: "24h",
    });
}

module.exports = {


    async showUsers(req, res) {
        try {
            const usuarios = await Usuario.find();
            return res.json(usuarios);

        } catch (err) {
            console.log(err)
            return res.json({

                status: 500,
                mensagem: 'Erro em buscar lista de usuarios '
            });
        }

    },

    async show(req, res) {
        try {

            const usuario = await Usuario.findById(req.params.id);

            if (usuario) {
                return res.json({

                    status: 200,
                    mensagem: "Usuario encontrado",
                    usuario
                });
            } else {
                return res.json({

                    status: 500,
                    mensagem: "Usuario nao encontrado",

                });

            }
        } catch (err) {
            console.log(err)
            return res.json({

                status: 500,
                mensagem: 'Erro em buscar usuario'
            });
        }
    },

    async createUser(req, res) {

        try {
            const { nome, sobrenome, email, senha } = req.body;

            if ((!nome) || (!sobrenome) || (!email) || (!senha)) {
                return res.json({
                    status: 400,
                    mensagem: 'Todos os campos precisam ser preenchidos',
                })
            }

            if (!validator.validate(email)) {
                return res.json({
                    status: 406,
                    mensagem: 'Formato do email não é valido',
                })

            }
            if (await Usuario.findOne({ email })) {
                return res.json({
                    status: 412,
                    mensagem: 'Usuario ja existe',
                })
            }

            usr = req.body;

            usr.criadoEm = moment.tz(new Date(), "YYYY-MM-DD HH:mm", "America/Sao_Paulo").toString();
            const usuario = await Usuario.create(usr);
            emailService.send(1, req.body.email, req.body.nome);

            usuario.senha = undefined;
            if (usuario) {
                return res.json({
                    status: 200,
                    mensagem: 'Cadastrado com sucesso',
                    usuario
                });
            } else {
                return res.json({
                    status: 500,
                    mensagem: 'Erro no cadastro do usuario',
                });
            }
        } catch (err) {
            return res.json({
                status: 500,
                mensagem: 'Erro no registro do usuario',
                error: err

            });
        }

    },

    async authenticate(req, res) {
        const { email, senha } = req.body;

        const usuario = await Usuario.findOne({ email }).select('+senha');

        if ((!usuario) || (!bcrypt.compareSync(senha, usuario.senha))) {
            return res.json({
                status: 400,
                mensagem: 'Email e/ou senha incorreto(s)',

            });
        };

        return res.json({
            status: 200,
            success: true,
            mensagem: 'Usuario encontrado',
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
                    mensagem: 'Usuario não encontrado',
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
                mensagem: 'Email enviado',
            });

        } catch (err) {
            console.log(err)
            return res.json({

                status: 400,
                mensagem: 'Erro em recuperar o email',
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
            //req.userId = decoded.id;
            if (!err) {
                return res.json({
                    status: 200,
                    success: true,
                    user,
                    mensagem: 'Token valido',
                });
            } else {
                return res.json({
                    status: 401,
                    success: false,
                    error: err
                });
            }
        });
    },

    async updatePassword(req, res) {
      
        try {
            const { email, token: currentToken, senha } = req.body;
            const usuario = await Usuario.findOne({ email }).select('+ pwdToken  pwdExpires');

            if (!usuario) {
                return res.json({
                    status: 400,
                    mensagem: 'Usuario não encontrado',
                });
            }
            const now = new Date();
            if ((currentToken !== usuario.pwdToken) || (now > usuario.pwdExpires)) {
                return res.json({
                    status: 400,
                    mensagem: 'Token invalido',

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
                            mensagem: 'Erro ao salvar senha',
                            usuario,
                        });
                    }
                });
            });
            return res.json({
                status: 200,
                mensagem: 'Senha atualizada',
            });


        } catch (err) {
            console.log(err)
            return res.json({

                status: 400,
                mensagem: 'Erro em atualizar a senha',
                error: err
            });
        }


    },

    async update(req, res) {
        try {
            const { nome, sobrenome, email, senha } = req.body;

            if ((!nome) || (!sobrenome) || (!email) || (!senha)) {
                return res.json({
                    status: 400,
                    mensagem: 'Todos os campos precisam ser preenchidos',
                })
            }

            usr = req.body;
            const hash = await bcrypt.hash(usr.senha, 10);
            usr.senha = hash
            const usuario = await Usuario.findByIdAndUpdate(req.params.id, usr, { new: true, useFindAndModify: false });
            if (usuario) {
                return res.json({

                    status: 200,
                    mensagem: 'Usuario atualizado',
                    usuario
                });
            } else {
                return res.json({

                    status: 500,
                    mensagem: 'Erro em atualizar os dados do usuario',

                });

            }

        } catch (err) {
            console.log(err)
            return res.json({

                status: 500,
                mensagem: 'Erro em atualizar o usuario',
                error: err
            });
        }
    },

    async destroy(req, res) {


        try {
            const user = await Usuario.findById(req.params.id);

            if (user.perfil === "empresa") {

                const company = await empresa.find({ idEmpresario: req.params.id });
                await empresa.findByIdAndDelete(company._id);
                await Funcionario.deleteMany({ idEmpresa: company._id });
                await Servico.deleteMany({ idEmpresa: company._id });
                await Agenda.deleteMany({ idEmpresa: company._id });
                await Favoritos.deleteMany({ idEmpresa: company._id });
            }
            
            await Usuario.findByIdAndRemove(req.params.id);
            const usuario = await Usuario.findById(req.params.id);
            if (usuario) {
                return res.json({
                    status: 500,
                    mensagem: 'Erro em deletar o usuario',

                });

            } else {
                return res.json({
                    status: 200,
                    mensagem: 'Usuario deletado',

                });

            }

        } catch (err) {

            return res.json({
                status: 500,
                mensagem: 'Erro no processo de deletar o usuario',
                error: err
            });
        }


    }

};