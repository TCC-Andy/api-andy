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
        select: false,  
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
//Evento antes de salvar
UsuarioSchema.pre('save',async function(next) {
    const hash = await bcrypt.hash(this.senha,10);
    this.senha = hash;
    next();
});



//Registrar um model na aplicacao , agora o model Usuario vai estar disponivel com os atributos.
mongoose.model('Usuario', UsuarioSchema);