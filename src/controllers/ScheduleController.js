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

            const agenda = await Agenda.find({ idFuncionario: idFuncionario, dataAgenda: dataAgenda, valorServico: { $ne: null } })

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
                    status: 500,
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
            const agenda = await Agenda.find({ idEmpresa: req.params.idEmpresa, dataAgenda: dataAgenda }).sort({ nomeFuncionario: 1 });
            if (Object.keys(agenda).length > 0) {
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

        try {

            const agenda = await Agenda.findById({ _id: req.params.idSchedule });
            if (agenda.status == 0) {
                return res.json({
                    status: 200,
                    mensagem: 'Não foi encontrado nenhum registro ativo'
                })

            } else {

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

            if ((!servico) && (!funcionario)) {
                return res.json({
                    status: 500,
                    mensagem: 'É necessario ter servicos e funcionarios para este processo'

                })
            }

            agenda.nomeServico = servico.nome;
            agenda.valorServico = servico.preco;
            agenda.idEmpresa = servico.idEmpresa;
            agenda.sobrenomeFuncionario = funcionario.sobrenome;
            agenda.sobrenomeCliente = cliente.sobrenome;


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

        try {
            const { idCliente, dataAgenda } = req.body;
            if ((!idCliente) || (!dataAgenda)) {
                return res.json({
                    status: 400,
                    mensagem: 'Faltam informacoes para acessar os agendamentos',
                })
            }


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
                mensagem: 'Erro no processo de verificacao de servicos do cliente'

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
                mensagem: 'Erro no processo de verificacao de servicos do cliente'

            })
        }

    },

    async showDataSchedule(req, res) {
        try {

            const { dataAgenda, idEmpresa, idServico, tempoServico, hoje, horaAtual } = req.body;

            if (dataAgenda < hoje) {
                return res.json({
                    status: 400,
                    mensagem: 'Não pode ser escolhido data inferior a hoje'

                })

            }

            const func = await Funcionario.find({ idEmpresa, idServicos: { $in: [idServico] } });

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


            agendamento = [];


            const promise2 = await Promise.all(func.map(async funcionario => {
                agenda = await Agenda.find({ dataAgenda, status: 1, idFuncionario: funcionario.id }).sort({ inicioServico: 1 })

                return {
                    nome: funcionario.nome,
                    id: funcionario._id,
                    horaAlmocoInicio: funcionario.horaAlmocoInicio,
                    horaAlmocoFim: funcionario.horaAlmocoFim,
                    horaInicioTrabalho: funcionario.horaInicioTrabalho,
                    horaFimTrabalho: funcionario.horaFimTrabalho,
                    agenda
                };
            })
            )


            agendamentos = [promise2]


            agendaDiaria = []

            contador = moment.duration(tempoServico).asMinutes();
            agenda = []




            promise2.forEach((registro, casa) => {

                horariosDisponiveis = []

                registro.agenda.forEach((valor, indice, array) => {


                    if (indice == 0) {


                        horaAnterior = moment.tz(registro.horaInicioTrabalho, "HH:mm", "UTC")
                        horaPosterior = moment.tz(valor.inicioServico, "HH:mm", "UTC")
                        intervalo = (horaPosterior.diff(horaAnterior, 'minutes'))


                        for (var i = 0; i < intervalo; i += contador) {


                            horaAnterior.add(i, 'minutes')
                            if (horaPosterior.diff(horaAnterior, 'minutes') < contador) {
                                break;
                            }
                            inicioServico = horaAnterior.format('HH:mm')
                            horaAnterior.add(-i, 'minutes')
                            horaAnterior.add((i + contador), 'minutes')

                            fimServico = horaAnterior.format('HH:mm')
                            horaAnterior.add((-i - contador), 'minutes')


                            if (hoje == dataAgenda) {
                                if ((horaAtual == inicioServico) || (horaAtual < inicioServico)) {
                                    horariosDisponiveis.push(
                                        {
                                            inicioServico: inicioServico,
                                            fimServico: fimServico
                                        }
                                    )

                                }
                            } else {
                                horariosDisponiveis.push(
                                    {
                                        inicioServico: inicioServico,
                                        fimServico: fimServico
                                    }
                                )
                            }

                        }
                        if (array.length == 1) {

                            horaAnterior = moment.tz(valor.fimServico, "HH:mm", "UTC")
                            horaPosterior = moment.tz(registro.horaFimTrabalho, "HH:mm", "UTC")
                            intervalo = (horaPosterior.diff(horaAnterior, 'minutes'))


                            for (var i = 0; i < intervalo; i += contador) {

                                horaAnterior.add(i, 'minutes')
                                if (horaPosterior.diff(horaAnterior, 'minutes') < contador) {
                                    break;
                                }

                                inicioServico = horaAnterior.format('HH:mm')
                                horaAnterior.add(-i, 'minutes')
                                horaAnterior.add((i + contador), 'minutes')

                                fimServico = horaAnterior.format('HH:mm')
                                horaAnterior.add((-i - contador), 'minutes')

                                if (hoje == dataAgenda) {
                                    if ((horaAtual == inicioServico) || (horaAtual < inicioServico)) {
                                        console.log("Hora inicio almoco: " + registro.horaAlmocoInicio)
                                        console.log("Hora fim almoco: " + registro.horaAlmocoFim)

                                        horariosDisponiveis.push(
                                            {
                                                inicioServico: inicioServico,
                                                fimServico: fimServico
                                            }
                                        )

                                    }
                                } else {
                                    horariosDisponiveis.push(
                                        {
                                            inicioServico: inicioServico,
                                            fimServico: fimServico
                                        }
                                    )
                                }


                            }


                        }
                    }

                    else {


                        horaAnterior = moment.tz(array[indice - 1].fimServico, "HH:mm", "UTC")
                        horaPosterior = moment.tz(valor.inicioServico, "HH:mm", "UTC")
                        intervalo = (horaPosterior.diff(horaAnterior, 'minutes'))

                        for (var i = 0; i < intervalo; i += contador) {
                            horaAnterior.add(i, 'minutes')

                            if (horaPosterior.diff(horaAnterior, 'minutes') < contador) {
                                continue;
                            }
                            inicioServico = horaAnterior.format('HH:mm')
                            horaAnterior.add(-i, 'minutes')
                            horaAnterior.add((i + contador), 'minutes')

                            fimServico = horaAnterior.format('HH:mm')
                            horaAnterior.add((-i - contador), 'minutes')

                            if (hoje == dataAgenda) {
                                if ((horaAtual == inicioServico) || (horaAtual < inicioServico)) {
                                    horariosDisponiveis.push(
                                        {
                                            inicioServico: inicioServico,
                                            fimServico: fimServico
                                        }
                                    )
                                }
                            } else {
                                horariosDisponiveis.push(
                                    {
                                        inicioServico: inicioServico,
                                        fimServico: fimServico
                                    }
                                )
                            }

                        }

                        if ((array.length - 1) == indice) {
                            horaAnterior = moment.tz(valor.fimServico, "HH:mm", "UTC")
                            horaPosterior = moment.tz(registro.horaFimTrabalho, "HH:mm", "UTC")
                            intervalo = (horaPosterior.diff(horaAnterior, 'minutes'))


                            for (var i = 0; i < intervalo; i += contador) {

                                horaAnterior.add(i, 'minutes')
                                if (horaPosterior.diff(horaAnterior, 'minutes') < contador) {
                                    break;
                                }
                                inicioServico = horaAnterior.format('HH:mm')
                                horaAnterior.add(-i, 'minutes')
                                horaAnterior.add((i + contador), 'minutes')

                                fimServico = horaAnterior.format('HH:mm')
                                horaAnterior.add((-i - contador), 'minutes')

                                if (hoje == dataAgenda) {
                                    if ((horaAtual == inicioServico) || (horaAtual < inicioServico)) {
                                        horariosDisponiveis.push(
                                            {
                                                inicioServico: inicioServico,
                                                fimServico: fimServico
                                            }
                                        )
                                    }
                                } else {
                                    horariosDisponiveis.push(
                                        {
                                            inicioServico: inicioServico,
                                            fimServico: fimServico
                                        }
                                    )
                                }


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


            })



            return res.json({

                status: 200,
                agenda
            });

        } catch (err) {

            return res.json({

                status: 500,
                mensagem: 'Erro no processo de buscar data agendada',
                err
            });
        }
    }
};