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
 
    status: {
        type: Number,
        default: 1
    }, 

});


mongoose.model('Empresas', CompanySchema);