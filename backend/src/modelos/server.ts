import express from "express";
import cors from "cors";
import rutasUsuario from "../rutas/usuario.js";
import rutasMuebles from "../rutas/mueble.js";
import rutasCategorias from "../rutas/categoria.js";
import rutasSucursales from "../rutas/sucursal.js";
import db from "../db/conexion.js";
import { configurarAsociasiones } from "./asociaciones.js";
import rutasNotificaciones from "../rutas/notificacion.js";


export class Server{
    private app: express.Application;
    private port: string;
    
    constructor(){
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

    listen(){
        this.app.listen(this.port, () => {
        console.log(` Servidor corriendo en: http://localhost:${this.port}`);
        
        });
    }

    middlewares(){
        // permitir que el backend entienda las peticiones con formato json
        this.app.use(express.json());

        // cors: permite que angular (puerto 4200) pueda hacer peticiones al backend (puerto 3000)
        this.app.use(cors({
            origin: 'http://localhost:4200',
            credentials: true
        }));

        this.app.use((req, res, next) => {
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
        res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
        next();
        });
    }

    routes(){
        this.app.get("/ping",(req, res)=> res.send("el servidor esta vivo"));
        this.app.use('/api/categorias', rutasCategorias);
        this.app.use('/api/sucursales', rutasSucursales);
        this.app.use("/api/usuarios", rutasUsuario);
        this.app.use("/api/muebles", rutasMuebles);
        this.app.use('/api/notificaciones', rutasNotificaciones);
    }

    async dbConexion(){
        console.log("Conectando a la base de datos...");
        //verifica que los datos de conexion sean correctos
        try {
        await db.authenticate();
        console.log("Conexion a la base de datos establecida");
        // para hacer los joins
        configurarAsociasiones();
        } catch (error) {
            //si hay un error, lo muestra en la consola
            console.log("Error al conectar a la base de datos", error);
        }
    }    
}

export default Server;