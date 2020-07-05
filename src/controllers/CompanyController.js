const mongoose = require("mongoose");
const empresa = mongoose.model("Empresas");
const servico = mongoose.model("Servicos");
const geoService = require('../services/geoService');
const dateFormat = require('dateformat');
const { request } = require("express");


module.exports = {
    async createCompany(req, res) {

        try {

            const { numero, rua, bairro, cidade } = req.body;

            company = req.body
            company.coordenadas = await geoService.send(numero, rua, bairro, cidade)

            //console.log(numero+" "+rua+" "+bairro+" "+cidade)
            // console.log( await geoService.send(numero, rua, bairro, cidade))
            const emp = await empresa.create(company);
            if (emp) {
                return res.json({
                    status: 200,
                    mensagem: 'Empresa cadastrada',
                    emp
                })
            } else {
                return res.json({
                    status: 500,
                    mensagem: 'Empresa não encontrada',

                })
            }
        } catch (err) {
            return res.json({
                status: 400,
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
            const emp = await empresa.findOne({ 'idEmpresario': req.params.id });
            if (emp) {
                return res.json({

                    status: 200,
                    mensagem: "Empresa encontrada",
                    emp
                });
            } else {
                return res.json({

                    status: 200,
                    mensagem: "Empresa não encontrada",
                });

            }
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
            if (emp) {
                return res.json({

                    status: 200,
                    mensagem: "Empresa encontrada",
                    emp
                });
            } else {
                return res.json({

                    status: 200,
                    mensagem: "Empresa não encontrada",

                });

            }
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
            if (servicos) {
                return res.json({
                    servicos
                });
            } else {
                return res.json({
                    status: 500,
                    mensagem: 'Erro em buscar os serviços da empresa',
                });

            }
        } catch (err) {
            return res.json({
                status: 500,
                mensagem: 'Erro no processo de buscar os serviços da empresa',
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
                mensagem: 'Erro no processo de  buscar categorias de empresas',
            });
        }
    },

    async deleteCompany(req, res) {

        try {
            await empresa.findByIdAndRemove(req.params.id);
            return res.json({
                status: 200,
                mensagem: "Empresa deletada"
            })

        } catch (err) {
            console.log(err)
            return res.json({

                status: 400,
                mensagem: 'Erro em deletar empresa',

            });
        }

    },

    async updateCompany(req, res) {
        try {
            const { numero, rua, bairro, cidade,coordenadas } = req.body;

            const request = req.body;
          // console.log(request.coordenadas)
           //console.log(request.coordenadas.geometry.coordinates)
           
            request.coordenadas = await geoService.send(numero, rua, bairro, cidade)
           // console.log(JSON.stringify(request)) 
          // console.log(typeof request.coordenadas[0])
           
            //console.log(request.coordenadas.geometry.coordinates)
            const company = await empresa.findByIdAndUpdate(req.params.id, request, { new: true, useFindAndModify: false });


            if (company) {
                return res.json({
                    status: 200,
                    mensagem: 'Empresa atualizada',
                    company

                });
            } else {
                return res.json({
                    status: 500,
                    mensagem: 'Erro na atualização da empresa',

                });

            }
        } catch (err) {
            return res.json({
                status: 500,
                mensagem: 'Erro no processo de atualizar a empresa',
                error: err
            });
        }


    }



}