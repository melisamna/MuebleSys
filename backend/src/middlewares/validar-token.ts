import { type Request, type Response, type NextFunction} from "express";
import jwt from "jsonwebtoken";

export const validarToken = (req: Request, res: Response, next: NextFunction) => {
    const headerToken = req.headers['authorization'];

    if (headerToken != undefined && headerToken.startsWith('Bearer')){
        try{
            const token = headerToken.slice(7);

            //si pasan los 30 minutos, esta linea lanza un error automatico
            jwt.verify(token, process.env.SECRET_KEY || 'MuebleSys123');
            next();
        }catch{
            //si el token expiró, mandamos el 401
            res.status(401).json({msg: 'Sesion expirada'});
        }
    }  else {
        res.status(401).json({msg: 'Acceso denegado'});
    }
}