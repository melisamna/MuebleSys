import { DataTypes } from "sequelize";
import sequelize from "../db/conexion.js";
export const product = sequelize.define('product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING
    },
    descripcion: {
        type: DataTypes.STRING
    }
});
//# sourceMappingURL=product.js.map