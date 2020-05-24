const mongoose = require("mongoose");

const FuncionarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    sobrenome: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
	 idEmpresa: {
        type: String,
        required: true,
    },
	horaInicioTrabalho:{
       type: String
   },
   horaFimTrabalho:{
       type: String
   },
   horaAlmocoInicio:{
       type: String
   },
   horaAlmocoFim:{
       type: String
   },
   telefone:{
       type:String
   },
   idServicos: [{
        type: String
    }],
    status: {
        type: Number,
        default: 1
    },
    

});




mongoose.model('Funcionario', FuncionarioSchema);