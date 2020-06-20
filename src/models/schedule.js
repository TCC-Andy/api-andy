const mongoose = require("mongoose");


const AgendaSchema = new mongoose.Schema({
    idServico: {
        type: String
        
    },
    idFuncionario: {
        type: String
    },
    nomeFuncionario: {
        type: String
    },
    idCliente: {
        type: String
    },
    nomeCliente: {
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
    }
    

});

AgendaSchema.index({ dataAgenda: 1, idFuncionario: 1 }, { unique: true });


mongoose.model('Agendas', AgendaSchema);