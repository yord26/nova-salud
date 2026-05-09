const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const verificarToken = require('../middleware/auth');

const rutaArchivo = path.join(__dirname, '../data/productos.json');

function leerProductos() {
  return JSON.parse(fs.readFileSync(rutaArchivo, 'utf-8'));
}

function guardarProductos(productos) {
  fs.writeFileSync(rutaArchivo, JSON.stringify(productos, null, 2));
}

router.get('/', verificarToken, (req, res) => {
  res.json(leerProductos());
});

router.get('/alertas', verificarToken, (req, res) => {
  const productos = leerProductos();
  const bajoStock = productos.filter(p => Number(p.stock) <= Number(p.stockMinimo));
  res.json(bajoStock);
});

router.post('/', verificarToken, (req, res) => {
  const productos = leerProductos();
  const nuevo = {
    id: Date.now(),
    ...req.body,
    precio: Number(req.body.precio),
    stock: Number(req.body.stock),
    stockMinimo: Number(req.body.stockMinimo),
  };
  productos.push(nuevo);
  guardarProductos(productos);
  res.status(201).json(nuevo);
});

router.put('/:id', verificarToken, (req, res) => {
  const productos = leerProductos();
  const indice = productos.findIndex(p => p.id === parseInt(req.params.id));
  if (indice === -1) return res.status(404).json({ error: 'Producto no encontrado' });
  productos[indice] = {
    ...productos[indice],
    ...req.body,
    precio: Number(req.body.precio),
    stock: Number(req.body.stock),
    stockMinimo: Number(req.body.stockMinimo),
  };
  guardarProductos(productos);
  res.json(productos[indice]);
});

router.delete('/:id', verificarToken, (req, res) => {
  let productos = leerProductos();
  productos = productos.filter(p => p.id !== parseInt(req.params.id));
  guardarProductos(productos);
  res.json({ mensaje: 'Producto eliminado' });
});

module.exports = router;