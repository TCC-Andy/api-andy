const express = require("express");
const routes = express.Router();
const UserController = require("./controllers/UserController");


routes.get("/showUsers",UserController.showUsers);
routes.get("/retrieveUser/:id",UserController.show);
routes.post("/createUser",UserController.createUser);
routes.post("/authenticateUser",UserController.authenticate);
routes.put("/atualizaUsuarios/:id",UserController.update);
routes.delete("/deletaUsuarios/:id",UserController.destroy);

    module.exports = routes;