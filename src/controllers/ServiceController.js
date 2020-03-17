const mongoose = require("mongoose");
const Servico = mongoose.model("Servicos");


module.exports = {
    async createService(req, res) {

        try {
            //const { nome, descricao, preco, tempo, idEmpresa, status } = req.body;

            const service = await Servico.create(req.body);

            return res.json({
                status: 200,
                menssagem: 'Servico cadastrado',
            })

        } catch (err) {
            return res.json({
                status: 400,
                menssagem: 'Erro no serviço do registro',
            })
        }

    },

    async showServices(req, res) {
        const servicos = await Servico.find();
        return res.json(servicos);
    },






}