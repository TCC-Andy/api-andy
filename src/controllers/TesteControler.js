const mongoose = require("mongoose");
const validator = require("email-validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Teste = mongoose.model("Teste");
const emailService = require('../services/emailService');
var dateFormat = require('dateformat');
const authConfig = require('../config/auth');
const jwt = require('jsonwebtoken');

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: "24h",
    });
}

module.exports = {


    async showTeste(req, res) {
        try {
            const teste = await Teste.find({ 'status': req.params.status });

            console.log(teste)

            return res.json({
                status: 200,
                teste
            });

        } catch (err) {
            console.log(err)
            return res.json({

                status: 500,
                mensagem: 'Erro em buscar Dados',
            });
        }
    },

    async createTeste(req, res) {

        try {
            const { nome, status } = req.body;

            if ((!nome) || (!status)) {
                return res.json({
                    status: 406,
                    mensagem: 'Todos os campos precisam ser preenchidos',
                })
            }
            
            test = req.body;

            
            const teste = await Teste.create(test);
            
            return res.json({
                status: 200,
                mensagem: 'Cadastrado com sucesso',
                teste
            });
        } catch (err) {
            return res.json({
                status: 500,
                mensagem: 'Erro no registro do usuario',
                error: err

            });
        }

    },



};