const express = require("express");
const routes = express.Router();
const UserController = require("./controllers/UserController");
const ServiceController = require("./controllers/ServiceController");
const CompanyController = require("./controllers/CompanyController");
const EmployeeController = require("./controllers/EmployeeControler");
const ScheduleController = require("./controllers/ScheduleController");
const FavoriteController = require("./controllers/FavoriteController");


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
routes.get("/showServices/:idEmpresa",ServiceController.showServices);
routes.get("/showGlobalServices",ServiceController.showGlobalServices);
routes.get("/showService/:id",ServiceController.editServices);
routes.put("/updateService/:id",ServiceController.updateService);
routes.post("/addAgenda",ServiceController.addAgenda);
routes.delete("/deleteService/:id",ServiceController.destroyService);

//Rotas: Empresas

routes.post("/createCompany",CompanyController.createCompany);
routes.get("/showCompanies",CompanyController.showCompanies);
routes.get("/showCompany/:id",CompanyController.showCompany);
routes.get("/showCompanyUser/:id",CompanyController.showCompanyUser);
routes.get("/showCompanyServices/:idEmpresa",CompanyController.showCompanyServices);
routes.get("/showCategories/:categoria",CompanyController.showCategories);
routes.delete("/deleteCompany/:id",CompanyController.deleteCompany);
routes.put("/updateCompany/:id",CompanyController.updateCompany);

//Rotas: Empregados
routes.get("/showEmps/:idEmpresa",EmployeeController.showEmployees);
routes.post("/createEmp",EmployeeController.createEmployee);
routes.put("/updateEmp/:id",EmployeeController.updateEmp);
routes.get("/showEmp/:id",EmployeeController.showEmp);
routes.delete("/deleteEmp/:id", EmployeeController.deleteEmp);


//Rotas: Agendas
routes.post("/createSchedule",ScheduleController.createSchedule);
routes.post("/showDataSchedule",ScheduleController.showDataSchedule);
routes.post("/showClientCurrentSchedule",ScheduleController.showClientCurrentSchedule);
routes.get("/showClientHistSchedule/:idClient",ScheduleController.showClientHistSchedule);
routes.get("/deleteClientSchedule/:idSchedule",ScheduleController.deleteClientSchedule);

//Rotas: Favoritos
routes.post("/checkFavorite",FavoriteController.checkFavorite);
routes.get("/showFavorites/:idCliente",FavoriteController.showFavorites);

module.exports = routes;