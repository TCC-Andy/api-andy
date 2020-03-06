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
        type:String,
        required: true,
    },
    //Pesquisar a sintaxe correta para endereco
    endereco: {
        rua: {
            type: String
        },
        bairro: {
            type:String
        },
        cep:{
            type:String
        },
        latitude:{
            type:Number
        },
        longitude:{
            type:Number
        }
    },
    status: {
        type: Number,
        default: 1
    }, 

});

mongoose.model('Empresas',CompanySchema);
