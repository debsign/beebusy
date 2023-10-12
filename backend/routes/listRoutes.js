const express = require("express");
const listController = require("../controllers/listController");
const { authenticateJWT, isAdmin } = require("../middleware/auth");

const routes = express.Router();

// Rutas protegidas
routes.get("/lists", authenticateJWT, isAdmin, listController.getAllLists);
routes.post("/lists", authenticateJWT, isAdmin, listController.addList);
routes.put("/list/:id", authenticateJWT, isAdmin, listController.updateList);
routes.delete("/list/:id", authenticateJWT, isAdmin, listController.deleteList);

module.exports = routes;
