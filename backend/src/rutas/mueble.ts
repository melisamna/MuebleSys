import { Router } from "express";
import { deleteMueble, getMuebles, postMueble, updateMueble,getMueble, getPapelera, restaurarMueble, getEstadisticasCategorias } from "../controladores/mueble.js";
import { validarToken } from "../middlewares/validar-token.js";
import multer from 'multer';
import path from 'path';


const router = Router();

//configuracion de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'galeria/');
    },
    filename: (req, file, cb) =>{
        // Genera un nombre único: ID-nombre_original.extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({storage: storage});

//obtener todos los muebles
router.get('/',validarToken,getMuebles);
//obtener los muebles desactivados
router.get('/papelera', validarToken, getPapelera);

router.get('/estadisticas', getEstadisticasCategorias);

//restaurar los muebles desactivados
router.patch('/restaurar/:id', validarToken, restaurarMueble);

//obtener un solo mueble para editar un mueble (PUT)
router.get('/:id', validarToken, getMueble);
// Agregar un nuevo mueble (POST)
router.post('/', validarToken, upload.single('imagen'), postMueble);
// Actualizar un mueble existente (PUT)
router.put('/:id', upload.single('imagen'), updateMueble);
// Eliminar un mueble (desactivar) (DELETE)
router.delete('/:id',validarToken, deleteMueble);


export default router;