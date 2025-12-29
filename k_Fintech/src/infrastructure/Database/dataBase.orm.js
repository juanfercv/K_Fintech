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

sequelize.sync({ force: false, alter: true })
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
dueño.hasMany(tienda, { foreignKey: 'idDueño' })
tienda.belongsTo(dueño, { foreignKey: 'idDueño' })

//relacion tienda-factura
tienda.hasMany(factura, { foreignKey: 'idTienda' })
factura.belongsTo(tienda, { foreignKey: 'idTienda' })

//relacion factura-cliente
cliente.hasMany(factura, { foreignKey: 'idCliente' })
factura.belongsTo(cliente, { foreignKey: 'idCliente' })

//relacion factura-forma_pago
forma_pago.hasMany(factura, { foreignKey: 'idFormaPago' })
factura.belongsTo(forma_pago, { foreignKey: 'idFormaPago' })

//relacion factura-detalle_factura
detalle_factura.hasMany(factura, { foreignKey: 'idFactura' })
factura.belongsTo(detalle_factura, { foreignKey: 'idFactura' })

//relacion factura-detalle_total
detalle_total.hasMany(factura, { foreignKey: 'idFactura' })
factura.belongsTo(detalle_total, { foreignKey: 'idFactura' })

module.exports = {
	dueño,
	tienda,
	factura,
	forma_pago,
	cliente,
	detalle_factura,
	detalle_total
};
