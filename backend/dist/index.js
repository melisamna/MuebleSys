//importamos la clase Server para crear una instancia del servidor
import Server from "./modelos/server.js";
//importamos dotenv para poder leer el archivo . env (donde se guardan el secret_key y el puerto)
import dotenv from "dotenv";
//ejecutamos la configuracion de dotenv para que las variables esten disponibles
dotenv.config();
//creamos una instancia del servidor
const server = new Server();
//# sourceMappingURL=index.js.map