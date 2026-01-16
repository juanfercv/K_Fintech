const forma_pago = (sequelize, type) => {
    return sequelize.define('forma_pagos', {
        id_forma_pago: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: type.STRING,
            allowNull: false
        },
        descripcion: {
            type: type.STRING,
            allowNull: true
        },
        // --- NUEVOS CAMPOS AGREGADOS ---
        codigo_interno: {
            type: type.STRING(50),
            allowNull: true,
            defaultValue: 'GEN-001'
        },
        codigo_sri: {
            type: type.STRING(10),
            allowNull: true,
            defaultValue: 'SN' // Sin norma
        },
        permite_pago_diferido: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        maximo_cuotas: {
            type: type.INTEGER,
            defaultValue: 1
        },
        integracion_pasarela: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        // -------------------------------
        activo: {
            type: type.BOOLEAN,
            defaultValue: true
        },
        crearFormaPago: {
            type: 'TIMESTAMP',
            defaultValue: type.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
            field: 'created_at' // Recomendado: mapear a nombres estándar si es posible, si no, quita esta línea
        },
        actualizarFormaPago: {
            type: 'TIMESTAMP',
            defaultValue: type.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
            field: 'updated_at' // Recomendado
        }
    }, {
        timestamps: false, // Lo mantienes en false porque gestionas tus propios timestamps manualmente arriba
        tableName: 'forma_pagos'
    });
}

module.exports = forma_pago;