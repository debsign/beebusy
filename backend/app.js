// Importamos módulos y rutas
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const listRoutes = require("./routes/listRoutes");
const taskRoutes = require("./routes/taskRoutes");
// Cargamos variables desde ".env"
// para ello usamos el módulo dotenv
require("dotenv").config();
// Iniciamos Express
const app = express();
// Conectamos con MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// Middleware
// Cors: permite solicitudes de origen cruzado
// (interactuar con servidor desde cliente en otro dominio)
app.use(cors());
// Servidor parsee los cuerpos de las solicitudes json
app.use(express.json());
// Rutas
app.use("/api", userRoutes);
app.use("/api", projectRoutes);
app.use("/api", listRoutes);
app.use("/api", taskRoutes);
// Ruta raíz
app.get("/", (req, res) => {
  res.send(`Servidor de BeeBusy funcionando en el puerto ${PORT}`);
});
// Configuración del puerto
const PORT = process.env.PORT || 5001;
// Arranque del servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
