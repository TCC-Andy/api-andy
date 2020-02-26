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
mongoose.connect('mongodb+srv://andy:abttccandy@tcc-andy-valzi.gcp.mongodb.net/andy?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 2000
}).then(function () {
    console.log('Banco de dados conectado.');
}).catch(err => console.log(err));

requireDir("./src/models");

app.use('/rota',require('./src/routes'));

//iniciando o servidor
const port = process.env.PORT || 3001;

app.listen(port,function(){
    console.log("Porta 3001 aberta");
});