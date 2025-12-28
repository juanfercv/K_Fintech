const tiendaCTl = {}

const { Path } = require('path');

// Desde carpeta 'root'
const orm = require('../../Database/dataBase.orm');
const sql = require('../../Database/dataBase.sql');

tiendaCTl.mostrar = (req, res) => {
    res.render('tienda/agregar');
}

tiendaCTl.mandar = async (req, res) => {
    const id = req.user.idDueño
    const { idTienda, fotoTienda, nombreTienda, dueñoTienda, RUCTienda, dirección_matriz_tienda, direccion_sucursal_tienda, correo_electronico_tienda, telefono } = req.body
    const NuevoTienda = {
        fotoTienda,
        nombreTienda,
        dueñoTienda,
        RUCTienda,
        dirección_matriz_tienda,
        direccion_sucursal_tienda,
        correo_electronico_tienda,
        telefono
    }
    await orm.tienda.create(NuevoTienda)
    // const imagenTienda = req.files.fotoTienda;
    // const validacion = Path.extname(imagenTienda.name);
    // const extencion = [".PNG", ".JPG", ".JPEG", ".GIF", ".TIF", ".png", ".jpg", ".jpeg", ".gif", ".tif"];
    // if (!extencion.includes(validacion)) {
    //     req.flash('succes', 'Imagen no compatible');
    // }
    // if (!req.files){
    //     req.flash('success', 'Imagen no insertada');
    // }
    // const ubicacion = __dirname + '/../public/img/tienda/' + imagenTienda.name;
    // imagenTienda.mv(ubicacion, function(err) {
    //     if (err) {
    //         return req.flash('message', err);
    //     }
    //     sql.query('update tiendas set fotoTiendas = ? WHERE idTienda = ?', [
    //         imagenTienda.name,
    //         idTienda,
    //     ])
    // })
    // req.flash('success', 'Guardado con exito')
    res.redirect('/tienda/lista/' + id);
}

tiendaCTl.lista = async (req, res) => {
    const lista = await sql.query('select * from tiendas')
    res.render('tienda/lista', { lista })
}

tiendaCTl.traer = async (req, res) => {
    const ids = req.params.id
    const lista = await sql.query('select * from tiendas where idTienda = ?', [ids])
    res.render('tienda/editar', {lista})
}

tiendaCTl.actualizar = async (req, res) => {
    const id = req.user.idDueño
    const ids = req.params.id
    const { idTienda, fotoTienda, nombreTienda, dueñoTienda, RUCTienda, dirección_matriz_tienda, direccion_sucursal_tienda, correo_electronico_tienda, telefono } = req.body
    const nuevaShop = {
        fotoTienda,
        dueñoTienda,
        nombreTienda,
        RUCTienda,
        dirección_matriz_tienda,
        direccion_sucursal_tienda,
        correo_electronico_tienda,
        telefono,
    }
    await orm.tienda.findOne({ where: {idTienda: ids } })
        .then(actualizar => {
            actualizar.update(nuevaShop)
            req.flash('success', 'Actualizado con extio')
        })

        // const imagenTienda = req.files.fotoTienda;
        // const validacion = path.extname(imagenTienda.name);
        // const extencion = [".PNG", ".JPG", ".JPEG", ".GIF", ".TIF", ".png", ".jpg", ".jpeg", ".gif", ".tif"];

        // if (!extencion.includes(validacion)) {
        //     req.flash("success", "Imagen no compatible.");
        // }
        // if (!req.files){
        //     req.flash("success", "Imagen no insertada.");
        // }

        // const ubicacion = __dirname + '/../public/img/tienda/' + imagenTienda.name;

        // imagenTienda.mv(ubicacion, function (err) {
        //     if (err) {
        //         return req.flash('message', err);
        //     }
        //     sql.query('UPDATE tiendas set fotoTienda = ? WHERE idTienda = ?', [
        //         imagenTienda.name,
        //         idTienda,
        //     ])
        //     console.log('Imagen ingresada')
        // });
        res.redirect('/tienda/lista/' + ids);
}

module.exports = tiendaCTl;