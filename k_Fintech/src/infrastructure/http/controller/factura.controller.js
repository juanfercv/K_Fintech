const facturaCtl = {}

const orm = require('../../Database/dataBase.orm');
const sql = require('../../Database/dataBase.sql');

// API methods for frontend
facturaCtl.listarFacturas = async (req, res) => {
    try {
        const facturas = await sql.query('SELECT * FROM facturas');
        res.json(facturas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

facturaCtl.obtenerFactura = async (req, res) => {
    try {
        const id = req.params.id;
        const factura = await sql.query('SELECT * FROM facturas WHERE idFactura = ?', [id]);
        if (factura.length > 0) {
            res.json(factura[0]);
        } else {
            res.status(404).json({ message: 'Factura no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

facturaCtl.crearFactura = async (req, res) => {
    try {
        const { idTienda, idCliente, idFormaPago, fecha_emision, estado_factura } = req.body;
        
        const nuevaFactura = {
            idTienda,
            idCliente,
            idFormaPago,
            fecha_emision,
            estado_factura
        };
        
        const resultado = await orm.factura.create(nuevaFactura);
        res.status(201).json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

facturaCtl.actualizarFactura = async (req, res) => {
    try {
        const id = req.params.id;
        const { idTienda, idCliente, idFormaPago, fecha_emision, estado_factura } = req.body;
        
        const facturaActualizada = {
            idTienda,
            idCliente,
            idFormaPago,
            fecha_emision,
            estado_factura
        };
        
        const factura = await orm.factura.findOne({ where: { idFactura: id } });
        if (factura) {
            await factura.update(facturaActualizada);
            res.json(factura);
        } else {
            res.status(404).json({ message: 'Factura no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

facturaCtl.eliminarFactura = async (req, res) => {
    try {
        const id = req.params.id;
        const resultado = await orm.factura.destroy({ where: { idFactura: id } });
        if (resultado) {
            res.json({ message: 'Factura eliminada exitosamente' });
        } else {
            res.status(404).json({ message: 'Factura no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// View methods (for legacy handlebars views)
facturaCtl.Mostrar = async (req, res) => {
    const id = req.params.id
    const lista = await  sql.query('select * from tiendas where idTienda = ?', [id])
    res.render('factura/add', { lista })
}

facturaCtl.mandar = async (req, res) => {
    const id = req.params.id
    const { descripcion, cantidad, precio_unitario, precio_total } = req.body;
    
    const nuevoDetalleFactura = {
        descripcion,
        cantidad,
        precio_unitario,
        precio_total
    };
    
    await orm.detalle_factura.create(nuevoDetalleFactura);
    res.redirect('/factura/lista/' + id);
};

module.exports = facturaCtl;
module.exports = facturaCtl