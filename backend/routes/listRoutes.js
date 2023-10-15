// Importaciones de módulos y middlewares
const express = require("express");
const listController = require("../controllers/listController");
const { authenticateJWT, isAdmin } = require("../middleware/auth");
// Creación de nueva instancia de enrutador Express
const routes = express.Router();
// Definición de rutas para las operaciones CRUD
// Rutas sin proteger
routes.get("/lists", authenticateJWT, listController.getAllLists);
routes.post("/lists", authenticateJWT, listController.addList);
// Rutas protegidas admin
routes.put("/list/:id", authenticateJWT, isAdmin, listController.updateList);
routes.delete("/list/:id", authenticateJWT, isAdmin, listController.deleteList);
// Exportamos el enrutador
module.exports = routes;
