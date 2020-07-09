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
        type: String,
        required: true,
    },
    idEmpresario: {
        type: String
    },
    categoria: {
        type: String,
        required: true,
    },
    numero: {
        type: Number
    },
    descricao: {
        type: String
    },
    telefone: {
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
    complemento: {
        type: String
    },
    estado: {
        type: String
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
