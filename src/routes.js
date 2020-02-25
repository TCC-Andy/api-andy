const express = require("express");
const routes = express.Router();
const UserController = require("./controllers/UserController");



//criando primeira rota
routes.get("/usuarios",UserController.index);
routes.get("/usuarios/:id",UserController.show);
routes.post("/usuarios",UserController.store);
routes.put("/usuarios/:id",UserController.update);
routes.delete("/usuarios/:id",UserController.destroy);

    module.exports = routes;