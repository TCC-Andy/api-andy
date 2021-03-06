require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);
const requireDir = require("require-dir");
const cors = require("cors");


//iniciando a application
const app = express();

//aplicação pode ser usada em qualquer dominio
app.use(cors());

//usando formato json na app
app.use(express.json());

//iniciando o DB
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 2000
}).then(function () {
    console.log('Banco de dados conectado.');
}).catch(err => console.log(err));

requireDir("./src/models");

app.use(require('./src/routes'));

//iniciando o servidor
app.listen(process.env.PORT || 3001,function(){
    console.log("Porta "+(process.env.PORT || 3001)+" aberta");
});