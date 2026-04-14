import { DataTypes, Model } from 'sequelize';
import sequelize  from '../db/conexion.js';

export class MuebleView extends Model {
    // ← aquí, dentro de la clase pero ANTES del init
    declare mueble_id: number;
    declare nombre_mueble: string;
    declare descripcion: string;
    declare precio: number;
    declare stockActual: number;
    declare stockMinimo: number;
    declare imagen: string;
    declare esActivo: boolean;
    declare sucursal_id: number;
    declare nombre_categoria: string;
    declare direccion_sucursal: string;
    declare telefono_sucursal: string;
    declare sucursal_activa: boolean;
}

MuebleView.init({
    mueble_id:          { type: DataTypes.INTEGER, primaryKey: true },
    nombre_mueble:      { type: DataTypes.STRING },
    descripcion:        { type: DataTypes.STRING },
    precio:             { type: DataTypes.DECIMAL },
    stockActual:        { type: DataTypes.INTEGER },
    stockMinimo:        { type: DataTypes.INTEGER },
    imagen:             { type: DataTypes.STRING },
    esActivo:           { type: DataTypes.BOOLEAN },
    sucursal_id:        { type: DataTypes.INTEGER },
    nombre_categoria:   { type: DataTypes.STRING },
    direccion_sucursal: { type: DataTypes.STRING },
    telefono_sucursal:  { type: DataTypes.STRING },
    sucursal_activa:    { type: DataTypes.BOOLEAN }
}, {
    sequelize,
    tableName: 'view_MueblesDetallados',
    timestamps: false
});