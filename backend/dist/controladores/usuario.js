import {} from "express";
import { usuario } from "../modelos/usuario.js";
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
const CLIENT_ID = '88698713707-j5051t95pevu9gvbasrcnagv1d4li5ve.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);
export const loginGoogle = async (req, res) => {
    //este es el idToken que nos manda el frontend al loguearnos con google
    const { token } = req.body;
    console.log('Token recibido del frontend:', token);
    console.log('body completo:', req.body);
    try {
        // Verificar que el token sea autentico con los servidores de google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload) {
            return res.status(400).json({
                msg: 'Token de Google no válido'
            });
        }
        // extraemos nombre, correo y foto del usuario que google nos confirma que es real
        const { email, name, picture } = payload;
        //buscamos al usuario en sql por su correo
        let user = await usuario.findOne({ where: { username: email } });
        // si no existe en la base de datos, lo creamos
        if (!user) {
            //si es nuevo, guardamos todo
            return res.status(401).json({
                msg: `Acceso Denegado. El correo ${email} no está autorizado en MuebleSys.`
            });
        }
        //generamos un token de MuebleSys para que el frontend pueda hacer peticiones autenticadas al backend
        const sessionToken = jwt.sign({
            //No pedir datos sensibles en el token
            username: email,
            //metemos el nombre y la foto para mostrarlo en el frontend
            nombre_usuario: name,
            foto: picture
        }, process.env.SECRET_KEY || 'MuebleSys123', {
            //Tiempo de expiración del token
            expiresIn: '1h'
        });
        // Devolvemos el token al frontend
        res.json({ token: sessionToken });
    }
    catch (error) {
        // Acceder a los errores internos de tedious
        const erroresParent = error?.parent?.[Symbol.iterator]
            ? [...error.parent]
            : error?.parent?.errors
                ?? [];
        console.error('>>> Errores internos:', JSON.stringify(erroresParent, null, 2));
        console.error('>>> error.parent completo:', error?.parent);
        console.error('>>> error.message:', error?.message);
        res.status(400).json({ msg: 'Error', error: error?.message });
    }
};
//# sourceMappingURL=usuario.js.map