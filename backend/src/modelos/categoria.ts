import { DataTypes } from "sequelize";
import db from '../db/conexion.js'

export const Categoria = db.define('Categoria',{
    categoria_id:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement: true
    },
    nombre_categoria:{
        type:DataTypes.STRING
    },
},{
    tableName: 'CategoriasMueble',
    createdAt: false,
    updatedAt: false
    }
);