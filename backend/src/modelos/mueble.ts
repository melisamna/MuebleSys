import { DataTypes } from "sequelize";
import sequelize from "../db/conexion.js";

export const Mueble = sequelize.define('Mueble',{
    mueble_id:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    categoria_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    sucursal_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    nombre_mueble:{
        type:DataTypes.STRING,
        allowNull:false
    },
    descripcion:{
        type:DataTypes.STRING,
    },
    precio:{
        type:DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    imagen:{
        type:DataTypes.STRING,
    },
    stockActual:{
        type:DataTypes.INTEGER,
        defaultValue: 0
    },
    stockMinimo:{
        type:DataTypes.INTEGER,
        defaultValue: 1
    },
    esActivo:{
        type:DataTypes.BOOLEAN,
        defaultValue: true
    },
    fechaCreacion:{
        type:DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
},{
    timestamps:false,
    tableName: 'Muebles'
});
