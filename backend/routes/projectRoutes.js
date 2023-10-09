const express = require('express');
const projectController = require('../controllers/projectController');
const { authenticateJWT, isAdmin } = require('../middleware/auth');

const routes = express.Router();

// Rutas protegidas
routes.get('/projects', authenticateJWT, isAdmin, projectController.getAllProjects);
routes.post('/projects', authenticateJWT, isAdmin, projectController.addProject);
routes.get('/project/:id', authenticateJWT, isAdmin, projectController.getProjectById);
routes.put('/project/:id', authenticateJWT, isAdmin, projectController.updateProject);
routes.delete('/project/:id', authenticateJWT, isAdmin, projectController.deleteProject);
// Ruta para añadir una lista a un proyecto específico
routes.post('/project/:id/addList', authenticateJWT, isAdmin, projectController.addListToProject);


module.exports = routes;
