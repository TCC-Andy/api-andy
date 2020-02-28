const mongoose = require("mongoose");
const Usuario= mongoose.model("Usuario");

module.exports = {
async index(req,res){
    const usuarios = await Usuario.find();
    return res.json(usuarios);
},

async show(req,res){
const usuario = await Usuario.findById(req.params.id);
return res.json(usuario);
},

async store(req,res){
const usuario = await Usuario.create(req.body);
return res.json({
    status: 401,
    menssagem: 'Cadastrado com sucesso',
    usuario
    });
},

async update(req,res){
    const usuario = await Usuario.findByIdAndUpdate(req.params.id,req.body,{new: true, useFindAndModify: false});
    return res.json(usuario); 
},

async destroy(req,res){
    await Usuario.findByIdAndRemove(req.params.id);
    return res.send();
}

};