const mongoose = require("mongoose");
const Funcionario = mongoose.model("Funcionario");

module.exports = {
    async showEmployees(req, res) {
        const funcionarios = await Funcionario.find();
        return res.json(funcionarios);
    },

    async createEmployee(req, res) {
        try {

            const { nome, sobrenome, email, telefone, idServicos } = req.body;
            // console.log(nome,sobrenome,email,telefone,idServicos)
            if (Object.keys(idServicos).length < 1) {
                return res.json({
                    status: 400,
                    menssagem: 'Ao menos um servico deve ser marcado',
                })
            }

            if ((!nome) || (!sobrenome) || (!email) || (!telefone)) {
                return res.json({
                    status: 400,
                    menssagem: 'Todos os campos precisam ser preenchidos',
                })
            }


            if (await Funcionario.findOne({ email })) {
                return res.json({
                    status: 400,
                    menssagem: 'Empregado ja existe',
                })
            }

            func = req.body;

            func = await Funcionario.create(func);


            return res.json({
                status: 200,
                menssagem: 'Cadastrado com sucesso',
                func

            });
        } catch (err) {
            return res.json({
                status: 500,
                menssagem: 'Erro no registro do funcionario',
                error: err

            });
        }


    },


    async updateEmp(req, res) {
        const { nome, sobrenome, email, telefone, idServicos } = req.body;
        if (Object.keys(idServicos).length < 1) {
            return res.json({
                status: 400,
                menssagem: 'Ao menos um servico deve ser marcado',
            })
        }
        if ((!nome) || (!sobrenome) || (!email) ) {
            return res.json({
                status: 400,
                menssagem: 'É necessario preencher os campos ',
            })
        }
        //console.log(req.params.id)
        //Refatorar: Procurar outra função
        await Funcionario.findOne({ '_id': req.params.id }, function (err, func) {
            func.nome = nome
            func.sobrenome = sobrenome
            func.email = email
            func.telefone = telefone
            func.idServicos = idServicos
            fnc = func
            func.save(function (err) {
                if (err) {
                    return res.json({
                        status: 500,
                        menssagem: 'Erro ao salvar '

                    });
                }
            });
        });

        return res.json({
            status: 200,
            menssagem: 'Funcionario atualizado ',
            fnc

        });
       
    },






};//EndCode