// Importaciones de módulos y middlewares
const express = require("express");
const taskController = require("../controllers/taskController");
const { authenticateJWT, isAdmin } = require("../middleware/auth");
// Creación de nueva instancia de enrutador Express
const routes = express.Router();
// Definición de rutas para las operaciones CRUD
// Rutas sin proteger (todos los roles tienen full acceso a las tareas)
routes.get("/tasks", authenticateJWT, taskController.getAllTasks);
routes.post(
  "/admin/tasks",
  authenticateJWT,
  isAdmin,
  taskController.addTaskAdmin
);
routes.post("/tasks", authenticateJWT, taskController.addTask);
routes.put("/task/:id", authenticateJWT, taskController.updateTask);
routes.delete("/task/:id", authenticateJWT, taskController.deleteTask);
// Exportamos el enrutador
module.exports = routes;
