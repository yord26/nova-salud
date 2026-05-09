const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const Puerto = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/ventas', require('./routes/ventas'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'API Nova Salud funcionando' });
});

app.listen(Puerto, () => {
  console.log(`Servidor corriendo en puerto ${Puerto}`);
});