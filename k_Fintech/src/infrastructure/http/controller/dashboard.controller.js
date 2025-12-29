// controllers/dashboard.controller.js

const Cliente = require('../../domain/models/cliente');
const Tienda = require('../../domain/models/tienda');
const Factura = require('../../domain/models/factura');
const FormaPago = require('../../domain/models/forma_pago');
const DetalleFactura = require('../../domain/models/detalle_factura');
const DetalleTotal = require('../../domain/models/detalle_total');
const { Op } = require('sequelize');

// Controlador para las estadísticas del dashboard cliente
const getEstadisticasCliente = async (req, res) => {
  try {
    // Total facturado
    const totalFacturado = await Factura.sum('total', {
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date().getFullYear(), 0, 1), // Desde el inicio del año
        },
      },
    });

    // Facturas por estado
    const facturasPorEstado = await Factura.findAll({
      attributes: ['estado', [Factura.sequelize.fn('COUNT', Factura.sequelize.col('estado')), 'count']],
      group: ['estado'],
    });

    // Top clientes
    const topClientes = await Cliente.findAll({
      attributes: ['nombre_cliente', 'id_cliente'],
      include: [{
        model: Factura,
        attributes: [[Factura.sequelize.fn('SUM', Factura.sequelize.col('total')), 'total_facturado']],
        group: ['Factura.id_cliente'],
        required: false,
      }],
      order: [[Factura, 'total_facturado', 'DESC']],
      limit: 5,
      having: Factura.sequelize.where(
        Factura.sequelize.fn('SUM', Factura.sequelize.col('total')), 
        '>', 0
      ),
    });

    // Métodos de pago más usados
    const metodosPagoMasUsados = await FormaPago.findAll({
      attributes: ['nombre', 'id_forma_pago'],
      include: [{
        model: Factura,
        attributes: [[Factura.sequelize.fn('COUNT', Factura.sequelize.col('id_forma_pago')), 'uso']],
        group: ['Factura.id_forma_pago'],
        required: false,
      }],
      order: [[Factura, 'uso', 'DESC']],
      limit: 5,
    });

    res.json({
      totalFacturado: totalFacturado || 0,
      facturasPorEstado: facturasPorEstado,
      topClientes: topClientes,
      metodosPagoMasUsados: metodosPagoMasUsados,
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ message: 'Error obteniendo estadísticas' });
  }
};

module.exports = {
  getEstadisticasCliente,
};