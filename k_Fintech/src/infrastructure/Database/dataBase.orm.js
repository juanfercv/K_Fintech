const { Sequelize } = require("sequelize");

const { MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE, MYSQLPORT, MYSQL_URI, } = require("../../config/keys");

const sequelize = new Sequelize(MYSQLDATABASE, MYSQLUSER, MYSQLPASSWORD, {
	host: MYSQLHOST,
	port: MYSQLPORT,
	dialect: 'mysql'
});

// const sequelize = new Sequelize(
// 	'facturacion',
// 	'root',
// 	'',
// 	{
// 	  host: 'localhost',
// 	  dialect: 'mysql',
// 	  pool: {
// 		max: 5,
// 		min: 0,
// 		require: 30000,
// 		idle: 10000
// 	  }
// 	}
//   )

sequelize.authenticate()
	.then(() => {
		console.log("conectado");
	})
	.catch((err) => {
		console.log("no se conecto");
	});

sequelize.sync({ force: false })
	.then(() => {
		console.log("tablas sincronizadas");
	})
	.catch((err) => {
		console.log("error al sincronizar tablas: ", err.message);
	});

	const tiendaModel = require('../../domain/models/tienda');
const dueñoModel = require('../../domain/models/dueño');
const facturaModel = require('../../domain/models/factura');
const formaPagoModel = require('../../domain/models/forma_pago');
const clienteModel = require('../../domain/models/cliente');
const detalleFacturaModel = require('../../domain/models/detalle_factura');
const detalleTotalModel = require('../../domain/models/detalle_total');

//sincronia

const tienda = tiendaModel(sequelize, Sequelize)
const dueño = dueñoModel(sequelize, Sequelize)
const factura = facturaModel(sequelize, Sequelize)
const forma_pago = formaPagoModel(sequelize, Sequelize)
const cliente = clienteModel(sequelize, Sequelize)
const detalle_factura = detalleFacturaModel(sequelize, Sequelize)
const detalle_total = detalleTotalModel(sequelize, Sequelize)


//relacion tienda-dueño
dueño.hasMany(tienda)
tienda.belongsTo(dueño)

//relacion tienda-factura
tienda.hasMany(factura)
factura.belongsTo(tienda)

//relacion factura-cliente
cliente.hasMany(factura)
factura.belongsTo(cliente)

//relacion factura-forma_pago
forma_pago.hasMany(factura)
factura.belongsTo(forma_pago)

//relacion factura-detalle_factura
detalle_factura.hasMany(factura)
factura.belongsTo(detalle_factura)

//relacion factura-detalle_total
detalle_total.hasMany(factura)
factura.belongsTo(detalle_total)

module.exports = {
	dueño,
	tienda,
	factura,
	forma_pago,
	cliente,
	detalle_factura,
	detalle_total
};
