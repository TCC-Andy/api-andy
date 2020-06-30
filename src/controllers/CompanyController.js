const mongoose = require("mongoose");
const empresa = mongoose.model("Empresas");
const servico = mongoose.model("Servicos");
const geoService = require('../services/geoService');
const dateFormat = require('dateformat');


module.exports = {
    async createCompany(req, res) {

        try {

            const { numero, rua, bairro, cidade } = req.body;

            company = req.body
            company.coordenadas = await geoService.send(numero, rua, bairro, cidade)

            //console.log(numero+" "+rua+" "+bairro+" "+cidade)
            // console.log( await geoService.send(numero, rua, bairro, cidade))
            const emp = await empresa.create(company);

            return res.json({
                status: 200,
                mensagem: 'Empresa cadastrada',
                emp
            })

        } catch (err) {
            return res.json({
                status: 500,
                mensagem: 'Erro no registro da empresa',
                erro: err
            })
        }

    },

    async showCompanies(req, res) {
        //  var date = new Date();  // dateStr you get from mongodb
        // console.log(dateFormat(date, "dd/mm/yyyy HH:MM:ss UTC"))


        const empresas = await empresa.find();
        return res.json(empresas);
    },

    async showCompanyUser(req, res) {
        try {
            const emp = await empresa.findOne({'idEmpresario' : req.params.id});

            return res.json({

                status: 200,
                emp
            });

        } catch (err) {
            console.log(err)
            return res.json({

                status: 400,
                mensagem: 'Erro em buscar empresa',

            });
        }
    },

    async showCompany(req, res) {
        try {
            const emp = await empresa.findById(req.params.id);

            return res.json({

                status: 200,
                emp
            });

        } catch (err) {
            console.log(err)
            return res.json({

                status: 400,
                mensagem: 'Erro em buscar empresa',

            });
        }
    },

    async showCompanyServices(req, res) {
        try {
           
           const servicos = await servico.find({ 'idEmpresa': req.params.idEmpresa });
           return res.json({
             servicos
        });

        } catch (err) {
            return res.json({
                status: 500,
                mensagem: 'Erro em buscar os serviços da empresa',
            });

        }
    },

//A string categoria que existe na model empresa recebe o parametro chamado categoria
    async showCategories(req, res) {
        try {
            const empresas = await empresa.find({ 'categoria': req.params.categoria });
            return res.json(empresas);
        } catch (err) {
            console.log(err)
            return res.json({

                status: 500,
                mensagem: 'Erro em buscar categorias de empresas',
            });
        }
    },



}