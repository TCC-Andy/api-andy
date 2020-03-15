const mongoose = require("mongoose");
const Empresa = mongoose.model("Empresas");
const geoService = require('../services/geoService');


module.exports = {
    async createCompany(req, res) {

        try {

            const { numero, rua, bairro, cidade } = req.body;
          
           company = req.body
           company.coordenadas = await geoService.send(numero, rua, bairro, cidade)
           
           //console.log(numero+" "+rua+" "+bairro+" "+cidade)
          // console.log( await geoService.send(numero, rua, bairro, cidade))
            const empresa = await Empresa.create(company);

            return res.json({
                status: 200,
                menssagem: 'Empresa cadastrada',
            })

        } catch (err) {
            return res.json({
                status: 500,
                menssagem: 'Erro no registro da empresa',
                erro: err
            })
        }

    },

    async showCompanies(req, res) {
        const servicos = await Empresa.find();
        return res.json(servicos);
    },

}