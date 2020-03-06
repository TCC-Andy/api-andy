const mongoose = require("mongoose");
const Empresa = mongoose.model("Empresas");


module.exports = {
    async createCompany(req, res) {

        try {
           // const { nome, descricao, preco, tempo, idEmpresa, status } = req.body;

            const empresa = await Empresa.create(req.body);

            return res.json({
                status: 200,
                menssagem: 'Servico cadastrado',
            })

        } catch (err) {
            return res.status(500).send({ error: " Erro no registro do servico", prova: req.body });
        }

    },

    async showCompanies(req, res) {
        const servicos = await Empresa.find();
        return res.json(servicos);
    },

}