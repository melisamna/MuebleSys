import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
 dotenv.config();

 const dbName = process.env.DB_DATABASE;
 const dbUser = process.env.DB_USER;
 const dbPass = process.env.DB_PASSWORD;
 const dbHost = process.env.DB_HOST;

 if (!dbName || !dbUser || !dbPass || !dbHost){
    throw new Error("Error faltan variables");
 }

const sequelize = new Sequelize(
    dbName,
    dbUser, 
    dbPass,
    {
    host: dbHost,
    dialect: 'mssql',
    port: 1433,
    logging: console.log, // Habilita el logging de consultas SQL
    dialectOptions: {
        options: {
            encrypt: false, //false para conexiones locales, true para conexiones remotas
            trustServerCertificate: true //evita errores de certificado en conexiones locales
        }
    }
});

export default sequelize;