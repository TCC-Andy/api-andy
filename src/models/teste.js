const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var dateFormat = require('dateformat');

const TesteSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    status: {
        type: Number,
    }
});


//Registrar um model na aplicacao , agora o model Usuario vai estar disponivel com os atributos.
mongoose.model('Teste', TesteSchema);