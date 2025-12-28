const express = require("express");
const router = express.Router();
const facturaController = require('../controller/factura.controller');

// API endpoints for factura (invoices)
router.get('/api/facturas', facturaController.listarFacturas);
router.get('/api/facturas/:id', facturaController.obtenerFactura);
router.post('/api/facturas', facturaController.crearFactura);
router.put('/api/facturas/:id', facturaController.actualizarFactura);
router.delete('/api/facturas/:id', facturaController.eliminarFactura);

module.exports = router;