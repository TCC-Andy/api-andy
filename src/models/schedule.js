const mongoose = require("mongoose");


const AgendaSchema = new mongoose.Schema({
    idServico: {
        type: String
        
    },
    precoServico: {
        type: Number,
    },
    nomeServico: {
        type: String
    },
    idEmpresa: {
        type: String
    },
    idFuncionario: {
        type: String
    },
    nomeFuncionario: {
        type: String
    },
    sobrenomeFuncionario: {
        type: String
    },
    idCliente: {
        type: String
    },
    nomeCliente: {
        type: String
    },
    sobrenomeCliente: {
        type: String
    },
    dataAgenda: {
        type: String
    },
    inicioServico: {
        type: String
    },
    fimServico: {
        type: String
    },
    status: {
        type: Number,
        default: 1
    },
    hash: {
        type: String
    }
    

});

AgendaSchema.index({hash: 1 }, { unique: true });


mongoose.model('Agendas', AgendaSchema);