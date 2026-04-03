import { Router } from "express";
import { deleteMueble, getMuebles, postMueble, updateMueble,getMueble, getPapelera, restaurarMueble } from "../controladores/mueble.js";
import { validarToken } from "../middlewares/validar-token.js";

const router = Router();

//obtener todos los muebles
router.get('/',validarToken,getMuebles);
//obtener los muebles desactivados
router.get('/papelera', validarToken, getPapelera);

//obtener un solo mueble para editar un mueble (PUT)
router.get('/:id', validarToken, getMueble);
// Agregar un nuevo mueble (POST)
router.post('/', validarToken, postMueble);
// Actualizar un mueble existente (PUT)
router.put('/:id', updateMueble);
//restaurar los muebles desactivados
router.patch('/restaurar/:id', validarToken, restaurarMueble)
// Eliminar un mueble (desactivar) (DELETE)
router.delete('/:id', deleteMueble);



export default router;