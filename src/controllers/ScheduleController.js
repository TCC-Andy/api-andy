const mongoose = require("mongoose");
const Agenda = mongoose.model("Agendas");
const Funcionario = mongoose.model("Funcionario");


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
            const { dataAgenda, idEmpresa, idServico } = req.body;
            //Encontra os funcionarios que tem o idServico em algum dos servicos que praticam
            const func = await Funcionario.find({ idEmpresa, idServicos: { $in: [idServico] } });
            //console.log(func[1].nome)
            if (Object.keys(func).length < 1) {
                return res.json({
                    status: 500,
                    mensagem: 'Nenhum funcionario cadastrado para este servico'
                });
            }


            //const sched = await Agenda.find({ dataAgenda, idServico });
            //Logica que verifica se cada um dos funcionarios possui pelo menos um horario agendado no dia, se nao, eh criado um horario de almoco 
            // para posteriormente seguir com a logica de envio das agendas.
            func.map(async funcionario => {

                agenda = await Agenda.find({ dataAgenda, idServico, idFuncionario: funcionario.id });

                if (Object.keys(agenda).length < 1) {
                    Agenda.create({ idServico, idFuncionario: funcionario.id, nomeFuncionario: funcionario.nome, dataAgenda, inicioServico: funcionario.horaAlmocoInicio, fimServico: funcionario.horaAlmocoFim });
                }
            })


            // console.log(dataAgenda)
            return res.json({

                status: 200,
                mensagem: "Testando Agenda"

            });

        } catch (err) {

            return res.json({

                status: 500,
                mensagem: 'Erro em buscar data agendada',
                err
            });
        }
    }
};//EndCode