const mongoose = require("mongoose");
const validator = require("email-validator");
const Usuario = mongoose.model("Usuario");

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

        const { nome, sobrenome, email, senha } = req.body;
        //@ e . depois somente
        if (!validator.validate(email)) {
            return res.json({
                status: 406,
                menssagem: 'Formato do email não é valido',
            })

        }
        if(await Usuario.findOne({email})){
            return res.json({
                status: 412,
                menssagem: 'Usuario ja existe',
            })
        }
            
        try {
            const usuario = await Usuario.create(req.body);
            return res.json({
                status: 200,
                menssagem: 'Cadastrado com sucesso',
                usuario
            });
        } catch (err) {
            return res.status(500).send({error:" Erro no registro do usuario" });
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