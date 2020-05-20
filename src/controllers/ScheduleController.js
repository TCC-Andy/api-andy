const mongoose = require("mongoose");
const Agenda = mongoose.model("Agendas");
const Funcionario = mongoose.model("Funcionario");
const moment = require('moment');
const tz = require("moment-timezone")


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
            const { dataAgenda, idEmpresa, idServico,tempoServico } = req.body;
            //Encontra os funcionarios que tem o idServico em algum dos servicos que praticam
            const func = await Funcionario.find({ idEmpresa, idServicos: { $in: [idServico] } });
            //console.log(func[1].nome)
            if (Object.keys(func).length < 1) {
                return res.json({
                    status: 500,
                    mensagem: 'Nenhum funcionario cadastrado para este servico'
                });
            }


            //Logica que verifica se cada um dos funcionarios possui pelo menos um horario agendado no dia, se nao, eh criado um horario de almoco 
            // para posteriormente seguir com a logica de envio das agendas.
            const promise = func.map(async funcionario => {

                agenda = await Agenda.find({ dataAgenda, idFuncionario: funcionario.id });

                if (Object.keys(agenda).length < 1) {
                    Agenda.create({ idServico, idFuncionario: funcionario.id, nomeFuncionario: funcionario.nome, dataAgenda, inicioServico: funcionario.horaAlmocoInicio, fimServico: funcionario.horaAlmocoFim });
                }
            })
            //Deletar promise acima depois de refatorar
            await Promise.all(promise).then(async () => {
                agnd = await Agenda.find({ dataAgenda, idServico });
            }
            );
            //Construção do objeto 1
            
            agendamento = [];
            const promise2 = await Promise.all(func.map(async funcionario => {
                agenda = await Agenda.find({ dataAgenda, idFuncionario: funcionario.id }).sort({ inicioServico: 1 })

                return {
                    nome: funcionario.nome,
                    id: funcionario._id,
                    horaInicioTrabalho: funcionario.horaInicioTrabalho,
                    horaFimTrabalho: funcionario.horaFimTrabalho,
                    agenda
                };
            })
            )
            agendamentos = [promise2]
            //Testando moment.js

            inicio = moment.tz("14:00","HH:mm","UTC");
            console.log(inicio)
            final = moment.tz("15:10","HH:mm","UTC");
            console.log(final)
            console.log(final.diff(inicio, 'minutes'))
           

            //console.log(promise2.length)
            agendaDiaria = []
            promise2.forEach( registro =>{
                registro.agenda.forEach((valor,indice) =>{
                    if (indice == 0){
                     
                       // console.log("Indice zero")
                        console.log(registro.nome)
                        console.log(registro.horaInicioTrabalho)
                        console.log(valor.inicioServico)
                        horaAnterior = moment.tz(registro.horaInicioTrabalho,"HH:mm","UTC")
                        horaPosterior = moment.tz(valor.inicioServico,"HH:mm","UTC")
                        intervalo = (horaPosterior.diff(horaAnterior,'minutes'))
                      //  console.log(intervalo)
                       // console.log(tempoServico)
                        contador = parseInt(tempoServico)
                       // console.log(horaAnterior)
                       // console.log(horaAnterior.add(intervalo,'minutes'))
                        console.log(typeof contador)
                        for(var i = contador;i<intervalo;i+=contador){
                            console.log(horaAnterior.add(i,'minutes'))
                            horaAnterior.add(-i,'minutes')
                        }
                    }
                  //  console.log(indice,valor)
                    //console.log(valor)
                })
               // console.log(registro.agenda.length)
            })



            return res.json({

                status: 200,
               agendamentos
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