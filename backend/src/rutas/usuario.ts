import {Router} from 'express';

//importa unicamente la función de login con google del controlador de usuario
import {loginGoogle } from '../controladores/usuario.js';

const router = Router();

router.post("/login-google",loginGoogle);

export default router;