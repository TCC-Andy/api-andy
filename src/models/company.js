const mongoose = require("mongoose");


const CompanySchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    nomeFantasia: {
        type: String,
        required: true,
    },
    CNPJ: {
        type: Number,
        required: true,
    },
    categoria: {
        type: String,
        required: true,
    },
    numero:{
        type: Number
    },
    descricao: {
        type: String
    },
    rua: {
        type: String
    },
    bairro: {
        type: String
    },
    cidade: {
        type: String
    },
    cep: {
        type: String
    },
    complemento:{
        type:String
    },
    coordenadas: [{
        type: String
    }],
    status: {
        type: Number,
        default: 1
    },

});

mongoose.model('Empresas', CompanySchema);
