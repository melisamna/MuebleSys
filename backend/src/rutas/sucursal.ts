import { Router } from "express";
import { getSucursales } from "../controladores/sucursal.js";
import { validarToken } from "../middlewares/validar-token.js";

const router = Router();

//esta es la ruta que el front va a llamar
router.get('/', validarToken, getSucursales);

export default router;