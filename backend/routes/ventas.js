const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const verificarToken = require('../middleware/auth');

const rutaVentas = path.join(__dirname, '../data/ventas.json');
const rutaProductos = path.join(__dirname, '../data/productos.json');

function leerVentas() {
  return JSON.parse(fs.readFileSync(rutaVentas, 'utf-8'));
}

function leerProductos() {
  return JSON.parse(fs.readFileSync(rutaProductos, 'utf-8'));
}

function guardarVentas(ventas) {
  fs.writeFileSync(rutaVentas, JSON.stringify(ventas, null, 2));
}

function guardarProductos(productos) {
  fs.writeFileSync(rutaProductos, JSON.stringify(productos, null, 2));
}

// Obtener todas las ventas
router.get('/', verificarToken, (req, res) => {
  res.json(leerVentas());
});

// Registrar venta
router.post('/', verificarToken, (req, res) => {
  const { items, cliente } = req.body;
  const productos = leerProductos();
  let total = 0;

  // Verificar stock y descontar
  for (const item of items) {
    const producto = productos.find(p => p.id === item.productoId);
    if (!producto) return res.status(404).json({ error: `Producto ${item.productoId} no encontrado` });
    if (producto.stock < item.cantidad) return res.status(400).json({ error: `Stock insuficiente para ${producto.nombre}` });
    producto.stock -= item.cantidad;
    total += producto.precio * item.cantidad;
  }

  guardarProductos(productos);

  const ventas = leerVentas();
  const nuevaVenta = {
    id: Date.now(),
    cliente,
    items,
    total,
    fecha: new Date().toISOString(),
    vendedor: req.usuario.nombre
  };

  ventas.push(nuevaVenta);
  guardarVentas(ventas);
  res.status(201).json(nuevaVenta);
});

router.delete('/:id', verificarToken, (req, res) => {
  let ventas = leerVentas();
  ventas = ventas.filter(v => v.id !== parseInt(req.params.id));
  guardarVentas(ventas);
  res.json({ mensaje: 'Venta eliminada' });
});

module.exports = router;