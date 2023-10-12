const express = require("express");
const taskController = require("../controllers/taskController");
const { authenticateJWT, isAdmin } = require("../middleware/auth");

const routes = express.Router();

// Rutas protegidas
routes.get("/tasks", authenticateJWT, isAdmin, taskController.getAllTasks);
routes.post("/tasks", authenticateJWT, isAdmin, taskController.addTask);
routes.put("/task/:id", authenticateJWT, isAdmin, taskController.updateTask);
routes.delete("/task/:id", authenticateJWT, isAdmin, taskController.deleteTask);

module.exports = routes;
