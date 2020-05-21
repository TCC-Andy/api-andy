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
            //Recebo os horarios ja agendados
            agendamentos = [promise2]
         
           
            agendaDiaria = []
            
            contador = tempoServico
            contador = 40
            promise2.forEach( registro =>{
                registro.agenda.forEach((valor,indice,array) =>{
                   
                    if (indice == 0){
                       
                      
                        horaAnterior = moment.tz(registro.horaInicioTrabalho,"HH:mm","UTC")
                        horaPosterior = moment.tz(valor.inicioServico,"HH:mm","UTC")
                        intervalo = (horaPosterior.diff(horaAnterior,'minutes'))
                        
                       
                        for(var i = 0;i<intervalo;i+=contador){
                           
                            horaAnterior.add(i,'minutes')
                         
                          //  console.log(horaAnterior.format('HH:mm'))
                            horaAnterior.add(-i,'minutes')
                            horaAnterior.add((i+contador),'minutes')
                         
                          //  console.log(horaAnterior.format('HH:mm'))
                           
                            horaAnterior.add((-i-contador),'minutes')

                            //console.log()
                         
                            
                        }
                    }else{
                        //O nome e id irao ficar no começo do for maior
                        //validar se o contador eh menor que o intervalo e se se eu consigo eu consigo encaixar . ex 20  eh menor que 30 mas se
                        // eu tiver um tempo de 10:10 a 10:30 eu nao posso encaixar um trabalho de 20(o tempo iniciou com intervalo de 30 depois foi diminuindo)
                        // ou seja, fazer um if dentro do for para validar ate quando eu posso fazer essa contagem
                        //Dentro deste else fazer uma verificacao se for a ultima iteracao, para entao usar o horario do fim do servico da pessoa
                        console.log(indice)
                        console.log(registro.nome)
                        console.log(registro.id)
                  
                     
                      
                     horaAnterior = moment.tz(array[indice-1].fimServico,"HH:mm","UTC")
                     horaPosterior = moment.tz(valor.inicioServico,"HH:mm","UTC")
                     intervalo = (horaPosterior.diff(horaAnterior,'minutes'))
                
                     for(var i = 0;i<intervalo;i+=contador){
                       //O if a mais vai aquir pra saber ate quando eu posso contar
                        horaAnterior.add(i,'minutes')
                     
                        console.log(horaAnterior.format('HH:mm'))
                        horaAnterior.add(-i,'minutes')
                        horaAnterior.add((i+contador),'minutes')
                     
                       console.log(horaAnterior.format('HH:mm'))
                       
                        horaAnterior.add((-i-contador),'minutes')

                        console.log()
                     
                        
                    }

                       //console.log(horaAnterior)
                      // console.log(horaPosterior)
                     //  console.log(intervalo)

                      
                      //  intervalo = (horaPosterior.diff(horaAnterior,'minutes'))

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