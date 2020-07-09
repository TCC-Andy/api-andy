const mongoose = require("mongoose");
const Agenda = mongoose.model("Agendas");
const Funcionario = mongoose.model("Funcionario");
const Servico = mongoose.model("Servicos");
const Usuario = mongoose.model("Usuario");

const moment = require('moment');
const tz = require("moment-timezone")
const crypto = require("crypto");


module.exports = {

    async index(req, res) {
        const agenda = await Agenda.find();

        if (agenda) {
            return res.json({
                status: 200,
                mensagem: "Agendas encontrado",
                agenda
            })
        } else {
            return res.json({
                status: 400,
                mensagem: "Não existe agenda.",
            })
        }
    },

    async showScheduleByDateEmp(req, res) {

        try {
            const { idFuncionario, dataAgenda } = req.body;

            const agenda = await Agenda.find({ $and: [{ idFuncionario }, { dataAgenda }] })

            if (Object.keys(agenda).length > 0) {
                return res.json({
                    status: 200,
                    mensagem: "Agendas encontradas para o funcionario",
                    agenda
                })
            } else {
                return res.json({
                    status: 400,
                    mensagem: "Não existe agendamento para este funcionario",
                })
            }
        } catch (err) {

            return res.json({
                status: 500,
                mensagem: 'Erro no processo de busca de agendamentos do funcionario',
                erro: err
            })
        }
    },


    async changeScheduleStatus(req, res) {

        try {
            const { status, idAgenda } = req.body;

            const agenda = await Agenda.findByIdAndUpdate(idAgenda, { status: status }, { new: true, useFindAndModify: false });

            if (Object.keys(agenda).length > 0) {
                return res.json({
                    status: 200,
                    mensagem: "Status do agendamento alterado",
                    agenda
                })
            } else {
                return res.json({
                    status: 400,
                    mensagem: "Não foi possivel alterar o status do agendamento",
                })
            }
        } catch (err) {

            return res.json({
                status: 500,
                mensagem: 'Erro no processo de alteração de status do agendamento',
                erro: err
            })
        }
    },


    async showScheduleByCompany(req, res) {


        try {
            const { dataAgenda } = req.body;

            if (!dataAgenda) {
                return res.json({
                    status: 400,
                    mensagem: "É necessario enviar uma data para filtrar",
                })
            }
<<<<<<< HEAD
            const agenda = await Agenda.find({ idEmpresa: req.params.idEmpresa,dataAgenda: dataAgenda }).sort({ nomeFuncionario: 1});
            if (Object.keys(agenda).length >0) {
=======
            const agenda = await Agenda.find({ idEmpresa: req.params.idEmpresa, dataAgenda: dataAgenda }).sort({ nomeFuncionario: 1 });

            if (Object.keys(agenda).length > 0) {
>>>>>>> f365d744fd9d3280e28363de4b32ecc94ec12671
                return res.json({
                    status: 200,
                    mensagem: "Agendas encontradas nesta empresa",
                    agenda
                })
            } else {
                return res.json({
                    status: 400,
                    mensagem: "Não existe agendas para esta empresa",
                })
            }
        } catch (err) {

            return res.json({
                status: 500,
                mensagem: 'Erro no processo de busca de agendamentos da empresa',
                erro: err
            })
        }
    },


    async deleteClientSchedule(req, res) {
        //****Requisitos não funcionais***
        //OBS: Deleto sem verificar o dia e horario(registro antigo, serviço ja feito ou não)
        //O certo seria ter um status na agenda: agendado, atrasado,concluido,etc

        try {

            const agenda = await Agenda.findById({ _id: req.params.idSchedule });
            if (agenda.status == 0) {
                return res.json({
                    status: 200,
                    mensagem: 'Não foi encontrado nenhum registro ativo'
                })

            } else {
                // await Agenda.findByIdAndRemove({ _id: req.params.idSchedule });
                await Agenda.findByIdAndUpdate(req.params.idSchedule, {
                    '$set': {
                        status: 0
                    }
                });
                const remocao = await Agenda.findById({ _id: req.params.idSchedule });
                if (remocao.status == 0) {
                    return res.json({
                        status: 200,
                        mensagem: 'Registro removido'

                    })
                } else {
                    return res.json({
                        status: 200,
                        mensagem: 'Erro ao tentar remover o registro'

                    })
                }
            }

        } catch (err) {

            return res.json({
                status: 500,
                mensagem: 'Erro no processo de deletar o registro da agenda',
                erro: err
            })
        }

    },

    async createSchedule(req, res) {

        try {

            //****Requisitos não funcionais***
            //OBS: Criar agenda somente de um usuario por vez por enquanto
            //Verificar se o horario que ira agendar continua disponivel N
            //Verificar se conseguiu criar agenda S
            //Verificar se o horario que ira agendar pode ser encaixado, se ninguem escolheu algum horario proximo N
            //Verificar se id servico e id funcionario ainda existem N


            const { idServico, idFuncionario, nomeFuncionario, idCliente, nomeCliente, dataAgenda, inicioServico, fimServico, status } = req.body;

            if ((!idServico) || (!idFuncionario) || (!nomeFuncionario) || (!idCliente) || (!nomeCliente) || (!dataAgenda) || (!inicioServico) || (!fimServico) || (!fimServico)) {
                return res.json({
                    status: 400,
                    mensagem: 'Faltam informacoes para criar o registro da agenda',
                })
            }

            agenda = req.body

            const servico = await Servico.findById({ _id: agenda.idServico });
            const funcionario = await Funcionario.findById({ _id: agenda.idFuncionario });
            const cliente = await Usuario.findById({ _id: agenda.idCliente });
            agenda.nomeServico = servico.nome;
            agenda.valorServico = servico.preco;
            agenda.idEmpresa = servico.idEmpresa;
            agenda.sobrenomeFuncionario = funcionario.sobrenome;
            agenda.sobrenomeCliente = cliente.sobrenome;

            //Continuação do WA para conter multiplos acessos na base
            agenda.hash = crypto.randomBytes(20).toString('hex');

            const sched = await Agenda.create(agenda);

            if (sched) {
                return res.json({
                    status: 200,
                    mensagem: 'Registro na agenda efetuado',
                    sched
                })

            } else {
                return res.json({
                    status: 500,
                    mensagem: 'Erro em salvar o registro na agenda'

                })
            }

        } catch (err) {

            return res.json({
                status: 500,
                mensagem: 'Erro no processo de registro na agenda',
                erro: err
            })
        }

    },

    async showClientCurrentSchedule(req, res) {

        //****Requisitos não funcionais***
        //Verificar se tem o cliente e o registro
        //Verificar se naõ encontrou nenhum registro, eu só volto o array vazio, mas esta ok

        try {
            const { idCliente, dataAgenda } = req.body;
            if ((!idCliente) || (!dataAgenda)) {
                return res.json({
                    status: 400,
                    mensagem: 'Faltam informacoes para acessar os agendamentos',
                })
            }

            // yschedule = await Agenda.find({ idCliente, dataAgenda: { $gte: dataAgenda } }).sort({ dataAgenda: 1, inicioServico: 1 });

            /* schedule = await  Agenda.aggregate([
                  {$match : {inicioServico:"10:00"} }
              ])*/

            schedule = await Agenda.aggregate([

                { $match: { $and: [{ dataAgenda: { $gte: dataAgenda } }, { status: 1 }, { idCliente: idCliente }] } },
                { $sort: { dataAgenda: 1, inicioServico: 1 } },
                {
                    "$project": {
                        "idServico": {
                            "$toObjectId": "$idServico"
                        },
                        "inicioServico": 1,
                        "fimServico": 1,
                        "dataAgenda": 1,
                        "nomeFuncionario": 1,
                        "nomeCliente": 1
                    }
                },

                {
                    $lookup:
                    {
                        from: "servicos",
                        localField: "idServico",
                        foreignField: "_id",
                        as: "Servico"
                    }
                },
                {
                    "$unwind": "$Servico"
                },
                {
                    $addFields: {
                        "nomeServico": "$Servico.nome",
                        "descricaoServico": "$Servico.descricao",
                        "precoServico": "$Servico.preco",
                        "idServico": "$Servico._id"
                    }
                },

                {
                    "$project": {

                        "inicioServico": 1,
                        "fimServico": 1,
                        "dataAgenda": 1,
                        "nomeCliente": 1,
                        "Servico.nome": 1,
                        "Servico.status": 1,
                        "Servico.descricao": 1,
                        "Servico.tempo": 1,
                        "Servico.preco": 1,
                        "nomeServico": 1,
                        "descricaoServico": 1,
                        "nomeFuncionario": 1,
                        "idServico": 1,
                        "precoServico": 1,
                        "Servico.idEmpresa": {
                            "$toObjectId": "$Servico.idEmpresa"
                        },
                    }
                },
                {
                    $lookup:
                    {
                        from: "empresas",
                        localField: "Servico.idEmpresa",
                        foreignField: "_id",
                        as: "Empresa"
                    }
                },
                {
                    "$unwind": "$Empresa"
                },
                { $unset: ["Servico"] },
                {
                    $addFields: {
                        "idEmpresa": "$Empresa._id",
                        "nomeEmpresa": "$Empresa.nome",
                        "categoriaEmpresa": "$Empresa.categoria",
                        "descricaoEmpresa": "$Empresa.descricao",
                        "telefoneEmpresa": "$Empresa.telefone",
                        "nomeFantasiaEmpresa": "$Empresa.nomeFantasia",
                        "ruaEmpresa": "$Empresa.rua",
                        "bairroEmpresa": "$Empresa.bairro",
                        "cidadeEmpresa": "$Empresa.cidade",
                        "cepEmpresa": "$Empresa.cep",
                        "numeroEmpresa": "$Empresa.numero",
                        "coordenadaEmpresa": "$Empresa.coordenadas"
                    }
                },

                {
                    "$project": {
                        "inicioServico": 1,
                        "fimServico": 1,
                        "dataAgenda": 1,
                        "nomeCliente": 1,
                        "nomeFuncionario": 1,
                        "Servico.nome": 1,
                        "Servico.status": 1,
                        "Servico.descricao": 1,
                        "Servico.tempo": 1,
                        "Servico.preco": 1,
                        "nomeServico": 1,
                        "descricaoServico": 1,
                        "precoServico": 1,
                        "idServico": 1,
                        "nomeEmpresa": 1,
                        "nomeFantasiaEmpresa": 1,
                        "categoriaEmpresa": 1,
                        "descricaoEmpreesa": 1,
                        "telefoneEempresa": 1,
                        "ruaEmpresa": 1,
                        "bairroEmpresa": 1,
                        "cidadeEmpresa": 1,
                        "cepEmpresa": 1,
                        "numeroEmpresa": 1,
                        "idEmpresa": 1,
                        "coordenadaEmpresa": 1,

                    }
                },
            ])
            if (schedule) {
                return res.json({
                    status: 200,
                    schedule

                })
            } else {
                return res.json({
                    status: 400,
                    mensagem: "Nenhum registro encontrado"

                })
            }


        } catch (err) {

            return res.json({
                status: 500,
                mensagem: 'Erro na verificacao de servicos do cliente'

            })
        }

    },

    async showClientHistSchedule(req, res) {


        try {

            schedule = await Agenda.find({ idCliente: req.params.idClient, status: 1 }).sort({ dataAgenda: 1, inicioServico: 1 });


            return res.json({
                status: 200,
                schedule

            })

        } catch (err) {

            return res.json({
                status: 500,
                mensagem: 'Erro na verificacao de servicos do cliente'

            })
        }

    },

    async showDataSchedule(req, res) {
        try {
            
            const { dataAgenda, idEmpresa, idServico, tempoServico } = req.body;

            hoje = moment(new Date()).format("YYYY/MM/D")

            if (dataAgenda < hoje){
                return res.json({
                    status: 400,
                    mensagem: 'Não pode ser escolhido data inferior a hoje'
    
                })

            }

            //Encontra os funcionarios que tem o idServico em algum dos servicos que praticam
            const func = await Funcionario.find({ idEmpresa, idServicos: { $in: [idServico] } });
            //console.log(func[1].nome)
            if (Object.keys(func).length < 1) {
                return res.json({
                    status: 500,
                    mensagem: 'Nenhum funcionario cadastrado para este servico'
                });
            }


            const promise = await Promise.all(func.map(async funcionario => {

                agenda = await Agenda.find({ dataAgenda, status: 1, idFuncionario: funcionario.id });

                if (Object.keys(agenda).length == 0) {
                    try {
                        await Agenda.create({ idServico, idFuncionario: funcionario.id, nomeFuncionario: funcionario.nome, dataAgenda, inicioServico: funcionario.horaAlmocoInicio, fimServico: funcionario.horaAlmocoFim, status: 1, hash: funcionario.id + '' + dataAgenda });
                    } catch{
                        console.log("Tentativa de violacao de constraint UNIQUE")
                    }

                }
            }))

            //Deletar promise acima depois de refatorar
            /* await Promise.all(promise).then(async () => {
                 agnd = await Agenda.find({ dataAgenda, idServico });
             }
             );*/
            //Construção do objeto 1

            console.log("-------------------------------------------------")
            agendamento = [];


            const promise2 = await Promise.all(func.map(async funcionario => {
                agenda = await Agenda.find({ dataAgenda, status: 1, idFuncionario: funcionario.id }).sort({ inicioServico: 1 })

                return {
                    nome: funcionario.nome,
                    id: funcionario._id,
                    horaInicioTrabalho: funcionario.horaInicioTrabalho,
                    horaFimTrabalho: funcionario.horaFimTrabalho,
                    agenda
                };
            })
            )



            //console.log(promise2)
            //Recebo os horarios ja agendados
            agendamentos = [promise2]


            agendaDiaria = []

            //contador = tempoServico
            contador = moment.duration(tempoServico).asMinutes();
            agenda = []

            console.log(moment('08:58',"HH:mm").format("HH:mm"))
            console.log(moment(new Date()).format("HH:mm"))
           


            if (hoje == dataAgenda) {
                console.log("são iguais")
            }

            console.log(hoje)
            console.log(dataAgenda)

            promise2.forEach((registro, casa) => {

                horariosDisponiveis = []

                registro.agenda.forEach((valor, indice, array) => {



                    // console.log(registro.nome)
                    if (indice == 0) {


                        horaAnterior = moment.tz(registro.horaInicioTrabalho, "HH:mm", "UTC")
                        horaPosterior = moment.tz(valor.inicioServico, "HH:mm", "UTC")
                        intervalo = (horaPosterior.diff(horaAnterior, 'minutes'))


                        for (var i = 0; i < intervalo; i += contador) {


                            horaAnterior.add(i, 'minutes')
                            if (horaPosterior.diff(horaAnterior, 'minutes') < contador) {
                                break;
                            }
                            // console.log(horaAnterior.format('HH:mm'))
                            inicioServico = horaAnterior.format('HH:mm')
                            horaAnterior.add(-i, 'minutes')
                            horaAnterior.add((i + contador), 'minutes')

                            //console.log(horaAnterior.format('HH:mm'))
                            fimServico = horaAnterior.format('HH:mm')
                            horaAnterior.add((-i - contador), 'minutes')

                            // console.log()
                            horariosDisponiveis.push(
                                {
                                    inicioServico: inicioServico,
                                    fimServico: fimServico
                                }
                            )

                        }
                        //So entra se tiver somente um registro que é o registro de almoco
                        if (array.length == 1) {
                            // console.log(horaAnterior)
                            // console.log(horaPosterior)
                            // console.log(intervalo)
                            horaAnterior = moment.tz(valor.fimServico, "HH:mm", "UTC")
                            horaPosterior = moment.tz(registro.horaFimTrabalho, "HH:mm", "UTC")
                            intervalo = (horaPosterior.diff(horaAnterior, 'minutes'))


                            for (var i = 0; i < intervalo; i += contador) {

                                horaAnterior.add(i, 'minutes')
                                if (horaPosterior.diff(horaAnterior, 'minutes') < contador) {
                                    break;
                                }

                                // console.log(horaAnterior.format('HH:mm'))
                                inicioServico = horaAnterior.format('HH:mm')
                                horaAnterior.add(-i, 'minutes')
                                horaAnterior.add((i + contador), 'minutes')

                                //console.log(horaAnterior.format('HH:mm'))
                                fimServico = horaAnterior.format('HH:mm')
                                horaAnterior.add((-i - contador), 'minutes')
                                // console.log()
                                horariosDisponiveis.push(
                                    {
                                        inicioServico: inicioServico,
                                        fimServico: fimServico
                                    }
                                )


                            }


                        }
                    }


                    //Se nao for o primeiro array em que o iniciodo trabalho tem que ser contado
                    else {

                        //O nome e id irao ficar no começo do for maior
                        //validar se o contador eh menor que o intervalo e se se eu consigo eu consigo encaixar . ex 20  eh menor que 30 mas se
                        // eu tiver um tempo de 10:10 a 10:30 eu nao posso encaixar um trabalho de 20(o tempo iniciou com intervalo de 30 depois foi diminuindo)
                        // ou seja, fazer um if dentro do for para validar ate quando eu posso fazer essa contagem
                        //Dentro deste else fazer uma verificacao se for a ultima iteracao, para entao usar o horario do fim do servico da pessoa
                        //  console.log(indice)
                        //  console.log(registro.nome)
                        //  console.log(registro.id)



                        horaAnterior = moment.tz(array[indice - 1].fimServico, "HH:mm", "UTC")
                        horaPosterior = moment.tz(valor.inicioServico, "HH:mm", "UTC")
                        intervalo = (horaPosterior.diff(horaAnterior, 'minutes'))

                        for (var i = 0; i < intervalo; i += contador) {
                            //O if a mais vai aquir pra saber ate quando eu posso contar
                            horaAnterior.add(i, 'minutes')

                            if (horaPosterior.diff(horaAnterior, 'minutes') < contador) {
                                continue;
                            }
                            //console.log(horaAnterior.format('HH:mm'))
                            inicioServico = horaAnterior.format('HH:mm')
                            horaAnterior.add(-i, 'minutes')
                            horaAnterior.add((i + contador), 'minutes')

                            // console.log(horaAnterior.format('HH:mm'))
                            fimServico = horaAnterior.format('HH:mm')
                            horaAnterior.add((-i - contador), 'minutes')
                            //console.log()

                            horariosDisponiveis.push(
                                {
                                    inicioServico: inicioServico,
                                    fimServico: fimServico
                                }
                            )

                        }
                        // console.log()
                        // console.log(array.length-1)


                        //console.log(horaAnterior)
                        // console.log(horaPosterior)
                        //  console.log(intervalo)


                        //  intervalo = (horaPosterior.diff(horaAnterior,'minutes'))


                        if ((array.length - 1) == indice) {
                            horaAnterior = moment.tz(valor.fimServico, "HH:mm", "UTC")
                            horaPosterior = moment.tz(registro.horaFimTrabalho, "HH:mm", "UTC")
                            intervalo = (horaPosterior.diff(horaAnterior, 'minutes'))


                            for (var i = 0; i < intervalo; i += contador) {

                                horaAnterior.add(i, 'minutes')
                                if (horaPosterior.diff(horaAnterior, 'minutes') < contador) {
                                    break;
                                }
                                //console.log(horaAnterior.format('HH:mm'))
                                inicioServico = horaAnterior.format('HH:mm')
                                horaAnterior.add(-i, 'minutes')
                                horaAnterior.add((i + contador), 'minutes')

                                // console.log(horaAnterior.format('HH:mm'))
                                fimServico = horaAnterior.format('HH:mm')
                                horaAnterior.add((-i - contador), 'minutes')
                                // console.log()
                                horariosDisponiveis.push(
                                    {
                                        inicioServico: inicioServico,
                                        fimServico: fimServico
                                    }
                                )


                            }


                        }


                    }




                })
                agenda.push(
                    {
                        nome: registro.nome,
                        _id: registro.id,
                        idEmpresa: idEmpresa,
                        idServico: idServico,
                        dataServico: dataAgenda,
                        horariosDisponiveis: horariosDisponiveis
                    }
                )
                // console.log(registro.nome)
                // console.log(registro.id)
                // console.log(idEmpresa)
                // console.log(idServico)
                // console.log(dataAgenda)

                // console.log(registro.agenda.length)

            })



            return res.json({

                status: 200,
                agenda
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