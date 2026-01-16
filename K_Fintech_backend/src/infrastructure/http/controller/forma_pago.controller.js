const formaPagoCtl = {};

const orm = require('../../Database/dataBase.orm');

// API methods for payment methods (forma_pago)
formaPagoCtl.listarFormasPago = async (req, res) => {
    try {
        const formasPago = await orm.forma_pago.findAll();
        // Transform data to match frontend expectations
        const transformedData = formasPago.map(fp => ({
            id: fp.id_forma_pago,
            nombre: fp.nombre,
            descripcion: fp.descripcion,
            activo: fp.activo,
            codigoInterno: fp.codigo_interno,
            codigoSRI: fp.codigo_sri,
            permitePagoDiferido: fp.permite_pago_diferido,
            maximoCuotas: fp.maximo_cuotas,
            integracionPasarela: fp.integracion_pasarela,
            fechaCreacion: fp.crearFormaPago,
            fechaModificacion: fp.actualizarFormaPago
        }));
        res.setHeader('Cache-Control', 'no-store');
        res.json(transformedData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

formaPagoCtl.obtenerFormaPago = async (req, res) => {
    try {
        const id = req.params.id;
        const formaPago = await orm.forma_pago.findByPk(id);
        if (formaPago) {
            // Transform data to match frontend expectations
            const transformedData = {
                id: formaPago.id_forma_pago,
                nombre: formaPago.nombre,
                descripcion: formaPago.descripcion,
                activo: formaPago.activo,
                codigoInterno: formaPago.codigo_interno,
                codigoSRI: formaPago.codigo_sri,
                permitePagoDiferido: formaPago.permite_pago_diferido,
                maximoCuotas: formaPago.maximo_cuotas,
                integracionPasarela: formaPago.integracion_pasarela,
                fechaCreacion: formaPago.crearFormaPago,
                fechaModificacion: formaPago.actualizarFormaPago
            };
            res.json(transformedData);
        } else {
            res.status(404).json({ message: 'Forma de pago no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

formaPagoCtl.crearFormaPago = async (req, res) => {
    try {
        const { nombre, descripcion, codigoInterno, codigoSRI, permitePagoDiferido, maximoCuotas, integracionPasarela } = req.body;

        const nuevaFormaPago = {
            nombre,
            descripcion,
            activo: true,
            codigo_interno: codigoInterno,
            codigo_sri: codigoSRI,
            permite_pago_diferido: permitePagoDiferido,
            maximo_cuotas: maximoCuotas,
            integracion_pasarela: integracionPasarela
        };

        const resultado = await orm.forma_pago.create(nuevaFormaPago);

        const transformed = {
            id: resultado.id_forma_pago,
            nombre: resultado.nombre,
            descripcion: resultado.descripcion,
            activo: resultado.activo,
            codigoInterno: resultado.codigo_interno,
            codigoSRI: resultado.codigo_sri,
            permitePagoDiferido: resultado.permite_pago_diferido,
            maximoCuotas: resultado.maximo_cuotas,
            integracionPasarela: resultado.integracion_pasarela,
            fechaCreacion: resultado.crearFormaPago,
            fechaModificacion: resultado.actualizarFormaPago
        };

        res.status(201).json(transformed);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

formaPagoCtl.actualizarFormaPago = async (req, res) => {
    try {
        const id = req.params.id;
        const { nombre, descripcion, activo, codigoInterno, codigoSRI, permitePagoDiferido, maximoCuotas, integracionPasarela } = req.body;

        const formaPagoActualizada = {
            nombre,
            descripcion,
            activo,
            codigo_interno: codigoInterno,
            codigo_sri: codigoSRI,
            permite_pago_diferido: permitePagoDiferido,
            maximo_cuotas: maximoCuotas,
            integracion_pasarela: integracionPasarela
        };

        const formaPago = await orm.forma_pago.findByPk(id);
        if (formaPago) {
            await formaPago.update(formaPagoActualizada);
            const transformed = {
                id: formaPago.id_forma_pago,
                nombre: formaPago.nombre,
                descripcion: formaPago.descripcion,
                activo: formaPago.activo,
                codigoInterno: formaPago.codigo_interno,
                codigoSRI: formaPago.codigo_sri,
                permitePagoDiferido: formaPago.permite_pago_diferido,
                maximoCuotas: formaPago.maximo_cuotas,
                integracionPasarela: formaPago.integracion_pasarela,
                fechaCreacion: formaPago.crearFormaPago,
                fechaModificacion: formaPago.actualizarFormaPago
            };

            res.json(transformed);
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

formaPagoCtl.listarFormasPagoActivas = async (req, res) => {
    try {
        const formasPago = await orm.forma_pago.findAll({ where: { activo: true } });
        // Transform data to match frontend expectations
        const transformedData = formasPago.map(fp => ({
            id: fp.id_forma_pago,
            nombre: fp.nombre,
            descripcion: fp.descripcion,
            activo: fp.activo
        }));
        res.json(transformedData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = formaPagoCtl;