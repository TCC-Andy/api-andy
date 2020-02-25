const mongoose = require("mongoose")

const UsuarioSchema = new mongoose.Schema({
    nome:{
        type: String,
        required: true,
    },
    sobrenome:{
        type: String,
        required: true,
    },
    status:{
        type: Number,
        required: true,
    },
    criadoEm:{
        type: Date,
        default: Date.now,
    }

});
//Registrar um model na aplicacao , agora o model Usuario vai estar disponivel com os atributos.
mongoose.model('Usuario',UsuarioSchema);