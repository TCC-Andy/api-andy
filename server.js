const express = require("express");
const mongoose = require("mongoose");
const requireDir = require("require-dir");
const cors = require("cors");
//iniciando a application
const app = express();
//aplicação pode ser usada em qualquer dominio
app.use(cors());

//usando formato json na app
app.use(express.json());

//iniciando o DB
mongoose.connect('mongodb://localhost:27017/nodeMongoDB',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
}).then(function () {
    console.log('Banco de dados conectado.');
}).catch(err => console.log(err));




requireDir("./src/models");
//require("./src/models/user.js");

app.use('/rota',require('./src/routes'));




//iniciando o servidor
app.listen(3001,function(){
    console.log("Porta 3001 aberta");
});