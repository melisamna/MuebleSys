import { Router } from "express";
import { getNotificaciones, marcarLeida } from "../controladores/notificacion.js";

const router = Router();

router.get('/', getNotificaciones);
router.put('/:id', marcarLeida);

export default router;