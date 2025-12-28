const facturaCtl = {}


const orm = require('../../Database/dataBase.orm');
const sql = require('../../Database/dataBase.sql');

// facturaCtl.mostrar = async (req, res) => {
//     const id = req.params.id
//     const lista = await  sql.query('select * from tiendas where idTienda = ?', [id])
//     res.render('factura/agregar', { lista });
// }
facturaCtl.Mostrar = async (req, res) => {
    const id = req.params.id
    const lista = await  sql.query('select * from tiendas where idTienda = ?', [id])
    res.render('factura/add', { lista })
}

facturaCtl.mandar = async (req, res) => {
    const id = req.params.id
    // const ids = req.user.idFactura
    // const { fecha_emision } = req.body 
    // const nuevaFactura = {
    //     fecha_emision,
        
    // }
    const nuevoDetalleFactura = {
        descripcion,
        cantidad,
        precio_unitario,
        precio_total,
        
    }
    // const nuevoDetalleTotal = {
    //     base_imponible_12,
    //     base_imponible_0,
    //     descuento,
    //     valor_subtotal,
    //     valor_iva,
    //     valor_total
    // }
    // const nuevoFormaPago = {
    //     efectivo,
    //     tarjeta
    // }
    // const nuevoTienda = [
    //     fotoTienda,
    //     nombreTienda,
    //     dueñoTienda,
    //     RUCTienda,
    //     dirección_matriz_tienda,
    //     direccion_sucursal_tienda,
    //     telefono
    // ]
    // await orm.factura.create(nuevaFactura)
    await orm.detalle_factura.create(nuevoDetalleFactura)
    // await orm.detalle_total.create(nuevoDetalleTotal)
    // await orm.forma_pago.create(nuevoFormaPago)
    res.redirect('factura/lista' + ids);
}
module.exports = facturaCtl