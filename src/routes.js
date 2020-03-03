const express = require("express");
const routes = express.Router();
const UserController = require("./controllers/UserController");
const ServiceController = require("./controllers/ServiceController");


//Rotas: Usuario

routes.get("/showUsers",UserController.showUsers);
routes.get("/retrieveUser/:id",UserController.show);
routes.post("/createUser",UserController.createUser);
routes.post("/authenticateUser",UserController.authenticate);
routes.put("/atualizaUsuarios/:id",UserController.update);
routes.delete("/deletaUsuarios/:id",UserController.destroy);


//Rotas: Servicos

routes.post("/createService",ServiceController.createService);
routes.get("/showServices",ServiceController.showServices);



    module.exports = routes;