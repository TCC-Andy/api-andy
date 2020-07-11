const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var dateFormat = require('dateformat');

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
    senha: {
        type: String,
        required: true,
        select: false,
    },
    status: {
        type: Number,
        default: 1
    },
    pwdToken: {
        type: String,
        select: false,
    },
    pwdExpires: {
        type: Date,
        select: false,
    },
    criadoEm: {
        type: String
    },
    perfil: {
        type: String
    }

});

UsuarioSchema.pre('save', async function (next) {
    const hash = await bcrypt.hash(this.senha, 10);
    this.senha = hash;
    next();
});


mongoose.model('Usuario', UsuarioSchema);