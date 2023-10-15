// Importaciones de módulos y middlewares
const express = require("express");
const projectController = require("../controllers/projectController");
const { authenticateJWT, isAdmin } = require("../middleware/auth");
// Creación de nueva instancia de enrutador Express
const routes = express.Router();
// Definición de rutas para las operaciones CRUD
// Rutas sin proteger
routes.get("/projects", authenticateJWT, projectController.getAllProjects);
routes.post("/projects", authenticateJWT, projectController.addProject);
routes.get("/project/:id", authenticateJWT, projectController.getProjectById);
// Ruta para añadir una lista a un proyecto específico
routes.post(
  "/project/:id/addList",
  authenticateJWT,
  projectController.addListToProject
);
// Rutas protegidas admin
routes.put(
  "/project/:id",
  authenticateJWT,
  isAdmin,
  projectController.updateProject
);
routes.delete(
  "/project/:id",
  authenticateJWT,
  isAdmin,
  projectController.deleteProject
);
// Exportamos el enrutador
module.exports = routes;
