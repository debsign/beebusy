// Importaciones de módulos y middlewares
const express = require("express");
const userController = require("../controllers/userController");
const { authenticateJWT, isAdmin } = require("../middleware/auth");
// Creación de nueva instancia de enrutador Express
const routes = express.Router();
// Definición de rutas para las operaciones CRUD
// Rutas públicas sin autenticación
routes.post("/register", userController.register);
routes.post("/login", userController.login);
// Rutas protegidas admin
routes.get("/users", authenticateJWT, isAdmin, userController.getAllUsers);
routes.post("/users", authenticateJWT, isAdmin, userController.addUser);
routes.delete("/user/:id", authenticateJWT, isAdmin, userController.deleteUser);
// Rutas sin proteger
routes.get("/user/:id", authenticateJWT, userController.getUser);
routes.put("/user/:id", authenticateJWT, userController.updateUser);
// Rutas alertas
routes.post("/user/:id/alert", authenticateJWT, userController.addAlert);
routes.delete(
  "/user/:id/alert/:alertId",
  authenticateJWT,
  userController.deleteAlert
);
// Exportamos el enrutador
module.exports = routes;
