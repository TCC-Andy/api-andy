const mongoose = require("mongoose");
const Agenda = mongoose.model("Agendas");

module.exports = {


    async createSchedule(req, res) {

        try {
console.log("entrou")
            //Criar os bloqueios aqui
           
            const sched = await Agenda.create(req.body);

            return res.json({
                status: 200,
                menssagem: 'Agenda cadastrada',
                sched
            })

        } catch (err) {
            return res.json({
                status: 500,
                menssagem: 'Erro no registro da agenda',
                erro: err
            })
        }

    },






};//EndCode