import { DataTypes } from "sequelize";
import sequelize from "../db/conexion.js";
export const usuario = sequelize.define('usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    contrasena: {
        type: DataTypes.STRING,
        allowNull: true
    },
    nombre_usuario: {
        type: DataTypes.STRING,
    },
    foto: {
        type: DataTypes.STRING,
    },
}, {
    timestamps: false
});
//# sourceMappingURL=usuario.js.map