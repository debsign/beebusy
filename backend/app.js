const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const listRoutes = require('./routes/listRoutes');
const taskRoutes = require('./routes/taskRoutes');

require('dotenv').config();

const app = express();

// Conectar con MongoDB
mongoose.connect('mongodb://localhost:27017/beebusy', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', userRoutes);
app.use('/api', projectRoutes);
app.use('/api', listRoutes);
app.use('/api', taskRoutes);
app.get('/', (req, res) => {
  res.send(`Servidor de BeeBusy funcionando en el puerto ${PORT}`);
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
