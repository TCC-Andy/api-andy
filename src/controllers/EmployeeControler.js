const mongoose = require("mongoose");
const Funcionario = mongoose.model("Funcionario");

module.exports = {

    async showEmployees(req, res) {
        const funcionarios = await Funcionario.find({ idEmpresa: req.params.idEmpresa });
        return res.json({ funcionarios });
    },

    async createEmployee(req, res) {

        try {

            const { nome, sobrenome, email, telefone, idServicos } = req.body;

            if (Object.keys(idServicos).length < 1) {
                return res.json({
                    status: 400,
                    mensagem: 'Ao menos um servico deve ser marcado',
                })
            }

            if ((!nome) || (!sobrenome) || (!email) || (!telefone)) {
                return res.json({
                    status: 400,
                    mensagem: 'Todos os campos precisam ser preenchidos',
                })
            }


            if (await Funcionario.findOne({ email })) {
                return res.json({
                    status: 400,
                    mensagem: 'Funcionario ja existe',
                })
            }

            func = req.body;
            func = await Funcionario.create(func);

            if (func) {
                return res.json({
                    status: 200,
                    mensagem: 'Funcionario cadastrado com sucesso',
                    func

                });
            } else {
                return res.json({
                    status: 500,
                    mensagem: 'Erro ao cadastrar funcionario'

                });
            }
        } catch (err) {
            return res.json({
                status: 500,
                mensagem: 'Erro no processo de cadastro do funcionario',
                error: err

            });
        }


    },

    async showEmp(req, res) {
        try {
            const func = await Funcionario.findById(req.params.id, 'nome sobrenome email telefone horaInicioTrabalho horaAlmocoInicio horaAlmocoFim horaFimTrabalho servicosSelection.value servicosSelection.label');

            return res.json({

                status: 200,
                func
            });

        } catch (err) {

            return res.json({

                status: 500,
                mensagem: 'Erro no processo de buscar funcionario',
            });
        }
    },

    async updateEmp(req, res) {
        try {
            const servico = await Funcionario.findByIdAndUpdate(req.params.id, req.body, { new: true, useFindAndModify: false });
            await servico.save();
            return res.json({
                status: 200,
                mensagem: "Funcionario atualizado com sucesso"

            })
        } catch (err) {

            return res.json({
                status: 500,
                mensagem: 'Erro no processo de atualizar o funcionario',
            });
        }
    },


    async deleteEmp(req, res) {
        try {
            await Funcionario.findByIdAndRemove(req.params.id);
            return res.json({
                status: 200,
                mensagem: "Funcionario deletado"
            })
        } catch (err) {

            return res.json({

                status: 500,
                mensagem: 'Erro no processo de deletar o funcionario',
            });
        }
    }

};