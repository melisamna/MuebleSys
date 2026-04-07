import { DataTypes } from "sequelize";
import sequelize from "../db/conexion.js";
import { Mueble } from "./mueble.js";

export const Notificacion = sequelize.define('Notificacion',{
    notificacion_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    mensaje:{
        type: DataTypes.STRING(500),
        allowNull: false
    },
    tipo:{
        type:DataTypes.STRING(50),
        defaultValue: 'STOCK_BAJO'
    },
    leida:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    mueble_id:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    sucursal_id:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    fecha_creacion:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
},{
    timestamps: false,
    tableName: 'Notificaciones'
});

Notificacion.belongsTo(Mueble, { foreignKey: 'mueble_id'});