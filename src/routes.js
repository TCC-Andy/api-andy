const express = require("express");
const routes = express.Router();
const UserController = require("./controllers/UserController");



//criando primeira rota
routes.get("/todosUsuarios",UserController.index);
routes.get("/unicoUsuarios/:id",UserController.show);
routes.post("/criarUsuario",UserController.store);
routes.put("/atualizaUsuarios/:id",UserController.update);
routes.delete("/deletaUsuarios/:id",UserController.destroy);

    module.exports = routes;