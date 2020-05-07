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

            const func = await Funcionario.find({ idEmpresa, idServicos: { $in: [idServico] } });
            //console.log(func[1].nome)
            if (Object.keys(func).length < 1) {
                return res.json({
                    status: 500,
                    mensagem: 'Nenhum funcionario cadastrado para este servico'
                });
            }

            //Verifiquei os funcionarios, agora tenho que ir na agenda com a data e com o id do funcionario acredito eu, e 
            //verificar se tenho registro para aquela data e aquele ID, se nao vou criar, se sim eu volto a data

            const sched = await Agenda.find({ dataAgenda });

            return res.json({

                status: 200,
                func
            });

        } catch (err) {

            return res.json({

                status: 500,
                mensagem: 'Erro em buscar data agendada',
            });
        }
    }
};//EndCode