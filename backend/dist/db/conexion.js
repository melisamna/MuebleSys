import { Sequelize } from "sequelize";
const sequelize = new Sequelize('MuebleSys_BD', 'sa', '123', {
    host: 'localhost',
    dialect: 'mssql',
    logging: console.log, // Habilita el logging de consultas SQL
    dialectOptions: {
        options: {
            encrypt: false, //false para conexiones locales, true para conexiones remotas
            trustServerCertificate: true //evita errores de certificado en conexiones locales
        }
    }
});
export default sequelize;
//# sourceMappingURL=conexion.js.map