const express = require("express");
const userController = require("../controllers/userController");
const { authenticateJWT, isAdmin } = require("../middleware/auth");

const routes = express.Router();

// Rutas públicas
routes.post("/register", userController.register);
routes.post("/login", userController.login);

// Rutas protegidas
routes.get("/users", authenticateJWT, isAdmin, userController.getAllUsers);
routes.post("/users", authenticateJWT, isAdmin, userController.addUser);
routes.get("/user/:id", authenticateJWT, isAdmin, userController.getUser);
routes.put("/user/:id", authenticateJWT, isAdmin, userController.updateUser);
routes.delete("/user/:id", authenticateJWT, isAdmin, userController.deleteUser);

routes.post("/user/:id/alert", authenticateJWT, userController.addAlert);
routes.delete(
  "/user/:id/alert/:alertId",
  authenticateJWT,
  userController.deleteAlert
);

module.exports = routes;
