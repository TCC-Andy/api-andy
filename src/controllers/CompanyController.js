const mongoose = require("mongoose");
const empresa = mongoose.model("Empresas");
const geoService = require('../services/geoService');


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
                menssagem: 'Empresa cadastrada',
                emp
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
        var date = new Date();  // dateStr you get from mongodb

        var d = date.getMinutes();
        var m = date.getMonth();

        console.log(d)

        const empresas = await empresa.find();
        return res.json(empresas);
    },

    async showCategories(req, res) {
        try {
            const empresas = await empresa.find({ 'categoria': req.params.categoria });
            return res.json(empresas);
        } catch (err) {
            console.log(err)
            return res.json({

                status: 500,
                menssagem: 'Erro em buscar categorias de empresas',
            });
        }
    },

   

}