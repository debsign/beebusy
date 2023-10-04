const express = require('express');
const userController = require('../controllers/userController');
const { authenticateJWT, isAdmin } = require('../middleware/auth');

const routes = express.Router();

// Rutas públicas
routes.post('/register', userController.register);
routes.post('/login', userController.login);

// Rutas protegidas
routes.get('/users', authenticateJWT, isAdmin, userController.getAllUsers);
routes.post('/users', authenticateJWT, isAdmin, userController.addUser);
routes.put('/user/:id', authenticateJWT, isAdmin, userController.updateUser);
routes.delete('/user/:id', authenticateJWT, isAdmin, userController.deleteUser);

module.exports = routes;
