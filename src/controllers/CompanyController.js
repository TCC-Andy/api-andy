const mongoose = require("mongoose");
const empresa = mongoose.model("Empresas");
const servico = mongoose.model("Servicos");
const geoService = require('../services/geoService');
const dateFormat = require('dateformat');
const { request } = require("express");
const { cnpj } = require('cpf-cnpj-validator');
const Usuario = mongoose.model("Usuario");
const Funcionario = mongoose.model("Funcionario");
const Servico = mongoose.model("Servicos");
const Agenda = mongoose.model("Agendas");
const Favoritos = mongoose.model("Favoritos");

module.exports = {
    async createCompany(req, res) {
        try {
            const { numero, rua, bairro, cidade, CNPJ } = req.body;
            if (!cnpj.isValid(CNPJ)) {
                return res.json({
                    status: 400,
                    mensagem: 'O CNPJ não é valido',
                })
            }
            company = req.body
            company.coordenadas = await geoService.send(numero, rua, bairro, cidade)
            const emp = await empresa.create(company);
            if (emp) {
                return res.json({
                    status: 200,
                    mensagem: 'Empresa cadastrada com sucesso',
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
                mensagem: 'Erro no processo de registro da empresa',
                erro: err
            })
        }
    },

    async showCompanies(req, res) {
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
                    status: 400,
                    mensagem: "Empresa não encontrada",
                });
            }
        } catch (err) {
            return res.json({
                status: 500,
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
                mensagem: 'Erro no processo de buscar a empresa',
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
            const company = await empresa.findById({ _id: req.params.id });
            if (!company) {
                return res.json({
                    status: 400,
                    mensagem: "Empresa não existe ou ja foi deletada"
                })
            }
            await Usuario.findByIdAndRemove(company.idEmpresario);
            await Funcionario.deleteMany({ idEmpresa: req.params.id });
            await Servico.deleteMany({ idEmpresa: req.params.id });
            await Agenda.deleteMany({ idEmpresa: req.params.id });
            await Favoritos.deleteMany({ idEmpresa: req.params.id });
            await empresa.findByIdAndRemove(req.params.id);
            return res.json({
                status: 200,
                mensagem: "A empresa foi deletada"
            })
        } catch (err) {
            console.log(err)
            return res.json({
                status: 400,
                mensagem: 'Erro no processo de deletar empresa',
            });
        }
    },

    async updateCompany(req, res) {
        try {
            const { numero, rua, bairro, cidade } = req.body;
            const request = req.body;
            const company = await empresa.findByIdAndUpdate(req.params.id, request, { new: true, useFindAndModify: false });
            if (company) {
                return res.json({
                    status: 200,
                    mensagem: 'Empresa atualizada com sucesso',
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