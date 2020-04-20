const mongoose = require("mongoose");
const Funcionario = mongoose.model("Funcionario");

module.exports = {
    async showEmployees(req, res) {
        const funcionarios = await Funcionario.find();
        return res.json(funcionarios);
    },

    async createEmployee(req, res) {
        try {

            const { nome, sobrenome, email, telefone } = req.body;
            console.log(nome,sobrenome,email,telefone)
            if ((!nome) || (!sobrenome) || (!email) || (!telefone)) {
                return res.json({
                    status: 406,
                    menssagem: 'Todos os campos precisam ser preenchidos',
                })
            }
           
           
            if (await Funcionario.findOne({ email })) {
                return res.json({
                    status: 412,
                    menssagem: 'Empregado ja existe',
                })
            }

            func = req.body;
            console.log("passou body")

           
            func = await Funcionario.create(func);
            

            return res.json({
                status: 200,
                menssagem: 'Cadastrado com sucesso'
               
            });
        } catch (err) {
            return res.json({
                status: 500,
                menssagem: 'Erro no registro do funcionario',
                error: err

            });
        }

    
    }

    

   

    

};