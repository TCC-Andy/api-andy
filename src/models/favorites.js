const mongoose = require("mongoose");


const FavoritoSchema = new mongoose.Schema({
    idCliente: {
        type: String
      
    },
    idEmpresa: {
        type: String
       
    },
    nomeEmpresa: {
        type: String
        
    },
    nomeFantasia: {
        type: String
       
    },
    CNPJ: {
        type: String
       
    },
    idEmpresario: {
        type: Number
    },
    categoria: {
        type: String
       
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
    coordenadas: [{
        type: String
    }]

});


mongoose.model('Favoritos', FavoritoSchema);