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
                    mensagem: 'Servico cadastrado com sucesso',
                })
            }
        } catch (err) {
            return res.json({
                status: 500,
                mensagem: 'Erro no processo de cadastro do serviço',
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
        const serv = await Servico.findById(idServico);
        return res.json({
            status: 200,
            mensagem: "Servicos disponiveis",
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

    async showServiceName(req, res) {

        const servico = await Servico.findById(req.params.idServico);
        return res.json({
            status: 200,
            servico
        });
    },

    async showGlobalServices(req, res) {
        const servicos = await Servico.find();
        return res.json({
            status: 200,
            servicos
        });
    },

    async updateService(req, res) {
        try {
            const { nome, descricao, valor, tempo } = req.body;
            const preco = valor.replace(',', '.');
            const servico = await Servico.findByIdAndUpdate(req.params.id, { nome, descricao, preco, tempo }, { new: true, useFindAndModify: false });
            await servico.save();
            return res.json({
                status: 200,
                mensagem: "Serviço atualizado com sucesso"
            })
        } catch (err) {
            return res.json({
                status: 500,
                mensagem: 'Erro no processo de atualizar o serviço',
            })
        }
    },


    async destroyService(req, res) {
        try{
        await Servico.findByIdAndRemove(req.params.id);
        return res.json({
            status: 200,
            mensagem: "Serviço deletado"
        })
    } catch (err) {
        return res.json({
            status: 500,
            mensagem: 'Erro no processo de exclusão do serviço',
        })
    }
    }
}