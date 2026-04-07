import { type Request, type Response} from "express";
import { Notificacion } from "../modelos/notificacion.js";
import { Mueble } from "../modelos/mueble.js";

//obtener notificaciones no leidas
export const getNotificaciones = async (req: Request, res: Response) =>{
    try{
        const lista = await Notificacion.findAll({
            where: {leida:false},
            order: [['fecha_creacion', 'DESC']],
            include: [
                {
                    model: Mueble,
                    attributes: ['nombre_mueble']
                }
            ]
        });
        res.json(lista);
    } catch (error) {
        res.status(500).json({msg: 'Error al recuperar notificaciones', error});
    }
}

export const marcarLeida = async (req:Request, res:Response) => {
    const { id } = req.params;

    if (!id){
        return res.status(400).json({msg: 'Id de notificación no proporcionado'});
    }

    const idNumber = parseInt(id as string);
    try {
        const noti = await Notificacion.findByPk(idNumber);

        if(noti){
            //aqui se actualiza el estado a leida(true)
            await noti.update({leida: true});
            res.json({msg: 'La notificacion ha sido marcada como leída'});
        } else {
            res.status(404).json({ msg: `No existe la notificación con el id ${idNumber}` });
        }
    }catch (error){
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar la notificación', error});
    }
};