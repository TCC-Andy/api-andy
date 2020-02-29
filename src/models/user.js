const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UsuarioSchema = new mongoose.Schema({
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
    senha:{
        type: String,
        required: true, 
    },
    status: {
        type: Number,
        default:1
    },
    criadoEm: {
        type: Date,
        default: Date.now,
    }

});


//Registrar um model na aplicacao , agora o model Usuario vai estar disponivel com os atributos.
mongoose.model('Usuario', UsuarioSchema);