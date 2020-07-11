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
                    mensagem: 'Empregado ja existe',
                })
            }

            func = req.body;
            func = await Funcionario.create(func);


            return res.json({
                status: 200,
                mensagem: 'Cadastrado com sucesso',
                func

            });
        } catch (err) {
            return res.json({
                status: 500,
                mensagem: 'Erro no registro do funcionario',
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
                mensagem: 'Erro em buscar funcionario',
            });
        }
    },

    async updateEmp(req, res) {

        const servico = await Funcionario.findByIdAndUpdate(req.params.id, req.body, { new: true, useFindAndModify: false });
        await servico.save();
        return res.json({
            status: 200
        })
    },


    async deleteEmp(req, res) {
        await Funcionario.findByIdAndRemove(req.params.id);
        return res.json({
            status: 200,
            mensagem: "Funcionario deletado"
        })
    }

};