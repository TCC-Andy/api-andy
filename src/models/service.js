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
    preco: {
        type: Number,
        required: true,
    },
    tempo: {
        type: String,
        required: true,
    },
    idEmpresa: {
        type: Number,
        required: true,
    },
    Agenda: [{
        nomeFuncionario: { type: String },
        horariosOcupados: [{
            inicio: { type: Date },
            cliente: { type: String },
            fim: { type: Date }
        }]
    }],
    status: {
        type: Number,
        default: 1
    },

});


mongoose.model('Servicos', ServicoSchema);