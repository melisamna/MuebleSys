import { DataTypes } from "sequelize";
import sequelize from "../db/conexion.js";
import { table } from "node:console";

export const Sucursal = sequelize.define('Sucursal',{
    sucursal_id:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    direccion_sucursal:{
        type: DataTypes.STRING
    },
    telefono_sucursal:{
        type: DataTypes.STRING
    },
    esActivo:{
        type: DataTypes.BOOLEAN,
        //por defecto, una nueva sucursal esta activa
        defaultValue: true
    }
},{
    timestamps: false,
    tableName: 'Sucursales'
});