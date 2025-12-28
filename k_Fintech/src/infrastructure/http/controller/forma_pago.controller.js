const formaPagoCtl = {};

const orm = require('../../Database/dataBase.orm');
const sql = require('../../Database/dataBase.sql');

// API methods for payment methods (forma_pago)
formaPagoCtl.listarFormasPago = async (req, res) => {
    try {
        const formasPago = await sql.query('SELECT * FROM forma_pagos');
        res.json(formasPago);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

formaPagoCtl.obtenerFormaPago = async (req, res) => {
    try {
        const id = req.params.id;
        const formaPago = await sql.query('SELECT * FROM forma_pagos WHERE id_forma_pago = ?', [id]);
        if (formaPago.length > 0) {
            res.json(formaPago[0]);
        } else {
            res.status(404).json({ message: 'Forma de pago no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

formaPagoCtl.crearFormaPago = async (req, res) => {
    try {
        const { efectivo, tarjeta } = req.body;
        
        const nuevaFormaPago = {
            efectivo,
            tarjeta
        };
        
        const resultado = await orm.forma_pago.create(nuevaFormaPago);
        res.status(201).json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

formaPagoCtl.actualizarFormaPago = async (req, res) => {
    try {
        const id = req.params.id;
        const { efectivo, tarjeta } = req.body;
        
        const formaPagoActualizada = {
            efectivo,
            tarjeta
        };
        
        const formaPago = await orm.forma_pago.findOne({ where: { id_forma_pago: id } });
        if (formaPago) {
            await formaPago.update(formaPagoActualizada);
            res.json(formaPago);
        } else {
            res.status(404).json({ message: 'Forma de pago no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

formaPagoCtl.eliminarFormaPago = async (req, res) => {
    try {
        const id = req.params.id;
        const resultado = await orm.forma_pago.destroy({ where: { id_forma_pago: id } });
        if (resultado) {
            res.json({ message: 'Forma de pago eliminada exitosamente' });
        } else {
            res.status(404).json({ message: 'Forma de pago no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = formaPagoCtl;