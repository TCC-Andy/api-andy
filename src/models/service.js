const mongoose = require("mongoose");


const ServicoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    descricao: {
        type: String,
        required: true, 
    },
    //Preco e tempo por enquanto como Number, mudar depois
    preco: {
        type: Number,
        required: true,
    },
    palavraChave: {
        type:Array,
        required: false,
    },
    tempo: {
        type: Number,
        required: true,
    },
    idEmpresa: {
        type: Number,
        required: true,
    },
    status: {
        type: Number,
        default: 1
    }, 

});


mongoose.model('Servicos', ServicoSchema);