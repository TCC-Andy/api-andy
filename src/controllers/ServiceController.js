const mongoose = require("mongoose");
const Servico = mongoose.model("Servicos");


module.exports = {
    async createService(req, res) {

        try {
            const { nome, descricao, preco, tempo, idEmpresa, status } = req.body;

            const service = await Servico.create(req.body);
            console.log("passei aqui tambem");

            return res.json({
                status: 200,
                menssagem: 'Servico cadastrado',
            })

        } catch (err) {
            return res.status(500).send({ error: " Erro no registro do servico", prova: req.body });
        }

    },

    async showServices(req, res) {
        const servicos = await Servico.find();
        return res.json(servicos);
    },






}