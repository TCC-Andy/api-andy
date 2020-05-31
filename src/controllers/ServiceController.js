const mongoose = require("mongoose");
const Servico = mongoose.model("Servicos");


module.exports = {
    async createService(req, res) {
        try {
            const { nome, descricao, valor, tempo, idEmpresa } = req.body;
            const service = await Servico.findOne({ nome: nome, idEmpresa: idEmpresa });
            if (service) {
                return res.json({
                    status: 400,
                    mensagem: 'Serviço já cadastrado.'
                })
            } else {
                const preco = valor.replace(',', '.');
                const servicos = await Servico.create({
                    nome,
                    descricao,
                    preco,
                    tempo,
                    idEmpresa
                });
                return res.json({
                    status: 200,
                    servicos,
                    mensagem: 'Servico cadastrado',
                })
            }
        } catch (err) {
            return res.json({
                status: 400,
                mensagem: 'Erro no serviço do registro',
            })
        }
    },

    async editServices(req, res) {
        const service = await Servico.findOne({ _id: req.params.id });
        return res.json({
            status: 200,
            service
        })
    },


    async addAgenda(req, res) {
        const { idServico } = req.body;
        //Criar a logica de  push para agendamente e sort
        const serv = await Servico.findById(idServico);
        return res.json({
            status: 200,
            mensagem: "Ainda para implementar",
            serv
        })
    },


    async showServices(req, res) {
        const servicos = await Servico.find({ idEmpresa: req.params.idEmpresa });
        return res.json({
            status: 200,
            servicos
        });

    },


    async updateService(req, res) {
        const { nome, descricao, valor, tempo } = req.body;
        const servico = await Servico.findByIdAndUpdate(req.params.id, { nome, descricao, preco: valor, tempo }, { new: true, useFindAndModify: false });
        await servico.save();
    },


    async destroyService(req, res) {
        await Servico.findByIdAndRemove(req.params.id);
        return res.json({
            status: 200,
            mensagem: "Servico deletado"
        })
    }
}