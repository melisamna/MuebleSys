import express from "express";
import cors from "cors";
import rutasUsuario from "../rutas/usuario.js";
import db from "../db/conexion.js";
export class Server {
    app;
    port;
    constructor() {
        this.app = express();
        this.port = process.env.PORT || "3000";
        // procesar json
        this.middlewares();
        // rutas
        this.routes();
        //conexion a la base de datos
        this.dbConexion();
        //encender el servidor
        this.listen();
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en puerto ${this.port}`);
        });
    }
    routes() {
        this.app.use("/api/usuarios", rutasUsuario);
    }
    middlewares() {
        // permitir que el backend entienda las peticiones con formato json
        this.app.use(express.json());
        // cors: permite que angular (puerto 4200) pueda hacer peticiones al backend (puerto 3000)
        this.app.use(cors());
    }
    async dbConexion() {
        console.log("Conectando a la base de datos...");
        //verifica que los datos de conexion sean correctos
        try {
            await db.authenticate();
            console.log("Conexion a la base de datos establecida");
        }
        catch (error) {
            //si hay un error, lo muestra en la consola
            console.log("Error al conectar a la base de datos", error);
        }
    }
}
export default Server;
//# sourceMappingURL=server.js.map