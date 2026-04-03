import { Router } from "express";
import { getCategorias } from "../controladores/categoria.js";
import { validarToken } from "../middlewares/validar-token.js";

const router = Router();

//esta es la ruta que llama en el front
router.get('/', validarToken, getCategorias);

export default router;