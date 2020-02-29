const express = require("express");
const routes = express.Router();
const UserController = require("./controllers/UserController");



//criando primeira rota
routes.get("/showUsers",UserController.showUsers);
routes.get("/unicoUsuarios/:id",UserController.show);
routes.post("/createUser",UserController.createUser);
routes.put("/atualizaUsuarios/:id",UserController.update);
routes.delete("/deletaUsuarios/:id",UserController.destroy);

    module.exports = routes;