const mongoose = require("mongoose");
const Agenda = mongoose.model("Agendas");

module.exports = {


    async createSchedule(req, res) {

        try {
            
            //Criar os bloqueios aqui

            const sched = await Agenda.create(req.body);

            return res.json({
                status: 200,
                mensagem: 'Agenda cadastrada',
                sched
            })

        } catch (err) {
            return res.json({
                status: 500,
                mensagem: 'Erro no registro da agenda',
                erro: err
            })
        }

    },

    async showDataSchedule(req, res) {
        try {
            const { dataAgenda } = req.body;
            
            const sched = await Agenda.find({ 'dataAgenda': dataAgenda });

            return res.json({

                status: 200,
                sched
            });

        } catch (err) {

            return res.json({

                status: 500,
                mensagem: 'Erro em buscar data agendada',
            });
        }
    }
};//EndCode