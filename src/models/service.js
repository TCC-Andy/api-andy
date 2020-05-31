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
    palavraChave: [{
        type: String
    }],
    //Preco e tempo por enquanto como Number, mudar depois, assim como INICIO, CLIENTE e FIM
    valor: {
        type: Number,
        required: true
    },
    tempo: {
        type: String,
        required: true,
    },
    idEmpresa: {
        type: String,
        required: true,
    },
    status: {
        type: Number,
        default: 1
    },

});


mongoose.model('Servicos', ServicoSchema);