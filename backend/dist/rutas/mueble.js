import { Router } from "express";
import { deleteMueble, getMuebles, postMueble, updateMueble } from "../controladores/mueble.js";
const router = Router();
// obtener todos los muebles (GET)
router.get('/', getMuebles);
// Agregar un nuevo mueble (POST)
router.post('/', postMueble);
// Actualizar un mueble existente (PUT)
router.put('/:id', updateMueble);
// Eliminar un mueble (desactivar) (DELETE)
router.delete('/:id', deleteMueble);
export default router;
//# sourceMappingURL=mueble.js.map