const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

function leerUsuarios() {
  const ruta = path.join(__dirname, '../data/usuarios.json');
  return JSON.parse(fs.readFileSync(ruta, 'utf-8'));
}

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const usuarios = leerUsuarios();
  const usuario = usuarios.find(u => u.email === email);

  if (!usuario) return res.status(401).json({ error: 'Usuario no encontrado' });

  const passwordValida = bcrypt.compareSync(password, usuario.password);
  if (!passwordValida) return res.status(401).json({ error: 'Contraseña incorrecta' });

  const token = jwt.sign(
    { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({ token, nombre: usuario.nombre, rol: usuario.rol });
});

module.exports = router;