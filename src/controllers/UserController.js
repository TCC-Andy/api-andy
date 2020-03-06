const mongoose = require("mongoose");
const validator = require("email-validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Usuario = mongoose.model("Usuario");
const emailService = require('../services/emailService');

module.exports = {
    async showUsers(req, res) {
        const usuarios = await Usuario.find();
        return res.json(usuarios);
    },

    async show(req, res) {
        const usuario = await Usuario.findById(req.params.id);
        return res.json(usuario);
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


            const usuario = await Usuario.create(req.body);
            emailService.send(1,req.body.email, req.body.nome);

            //Não voltar senha
            usuario.senha = undefined;
            return res.json({
                status: 200,
                menssagem: 'Cadastrado com sucesso',
                usuario
            });
        } catch (err) {
            return res.status(500).send({ error: " Erro no registro do usuario" });
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
            usuario
        });

    },

    async sendEmailToken(req, res) {
        const { email,nome } = req.body;

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
                now.setHours(now.getHours()+1);

                await Usuario.findByIdAndUpdate(user.id,{
                    '$set':{
                        pwdToken:token,
                        pwdExpires:now,
                    }
                });
                
/*
                 mailer.sendMail({
                to:email,
                from: "andy.services.it@gmail.com",
                template:"recoverPassword",
                context: {token},
            },(err)=>{
                if(err)
                return res.status(400).send({error : "Não pode enviar email"});
            
                return res.send();
            })

*/




emailService.send(2,req.body.email, req.body.nome,token,user.get("_id").toString());

return res.json({
                
    status: 400,
    menssagem: 'Foi',
});

        } catch (err) {
            console.log(err)
            return res.json({
                
                status: 400,
                menssagem: 'Erro em recuperar o email',
            });
        }
    },


    async update(req, res) {
        const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true, useFindAndModify: false });
        return res.json(usuario);
    },

    async destroy(req, res) {
        await Usuario.findByIdAndRemove(req.params.id);
        return res.send();
    }

};