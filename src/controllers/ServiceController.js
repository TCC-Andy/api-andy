const mongoose = require("mongoose");
const Servico = mongoose.model("Servicos");


module.exports = {
    async createService(req, res) {

        try {
            //const { nome, descricao, preco, tempo, idEmpresa, status } = req.body;

            const service = await Servico.create(req.body);

            return res.json({
                status: 200,
                mensagem: 'Servico cadastrado',
            })

        } catch (err) {
            return res.json({
                status: 400,
                mensagem: 'Erro no serviço do registro',
            })
        }
    },


    async addAgenda(req, res) {
        const {idServico} = req.body;
        //Criar a logica de  push para agendamente e sort
        console.log(idServico)
        const serv = await Servico.findById(idServico);
        return res.json({
            status: 200,
            mensagem: "Ainda para implementar",
            serv
        })
    },


    async showServices(req, res) {
        const servicos = await Servico.find();
        return res.json(servicos);
    },

 
     async updateService(req, res) {
        const serv = await Servico.findByIdAndUpdate(req.params.id, req.body, { new: true, useFindAndModify: false });
        return res.json({
            status: 200,
            serv
        })
    },

    
    async destroyService(req, res) {
        await Servico.findByIdAndRemove(req.params.id);
        return res.json({
            status: 200,
            mensagem: "Servico deletado"
        })
    }






}