const express = require("express");
const routes = express.Router();
const UserController = require("./controllers/UserController");
const ServiceController = require("./controllers/ServiceController");
const CompanyController = require("./controllers/CompanyController");
const EmployeeController = require("./controllers/EmployeeControler");


//Rotas: Usuarios

routes.get("/showUsers",UserController.showUsers);
routes.get("/retrieveUser/:id",UserController.show);
routes.post("/createUser",UserController.createUser);
routes.post("/authenticateUser",UserController.authenticate);
routes.put("/updateUser/:id",UserController.update);
routes.delete("/deleteUser/:id",UserController.destroy);
routes.post("/sendPassReset",UserController.sendEmailToken);
routes.get("/verifyToken/:id",UserController.verifyToken);
routes.post("/updatePassword",UserController.updatePassword);


//Rotas: Servicos

routes.post("/createService",ServiceController.createService);
routes.get("/showServices",ServiceController.showServices);
routes.put("/updateService/:id",ServiceController.updateService);
routes.post("/addAgenda",ServiceController.addAgenda);
routes.delete("/deleteService/:id",ServiceController.destroyService);

//Rotas: Empresas

routes.post("/createCompany",CompanyController.createCompany);
routes.get("/showCompanies",CompanyController.showCompanies);
routes.get("/showCompany/:id",CompanyController.showCompany);
routes.get("/showCompanyServices/:idEmpresa",CompanyController.showCompanyServices);
routes.get("/showCategories/:categoria",CompanyController.showCategories);

//Rotas: Empregados
routes.get("/showEmps",EmployeeController.showEmployees);
routes.post("/createEmp",EmployeeController.createEmployee);
routes.put("/updateEmp/:id",EmployeeController.updateEmp);
routes.get("/showEmp/:id",EmployeeController.showEmp);

module.exports = routes;