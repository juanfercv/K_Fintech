const factura=(sequelize,type)=>{
    return sequelize.define('facturas',{
        idFactura:{
            type:type.INTEGER,
            primaryKey:true,
            autoIncrement:true 
        },
        fecha_emision: type.STRING,
        crearFactura:{
            type:'TIMESTAMP',
            defaultValue: type.literal('CURRENT_TIMESTAMP'),
            allowNull:false
        },
        actualizarFactura:{
            type:'TIMESTAMP',
            defaultValue: type.literal('CURRENT_TIMESTAMP'),
            allowNull:false
        }
    }, {
        timestamps:false,
    });
}
module.exports = factura