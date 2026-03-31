import { type Request, type Response} from "express";
import { Mueble } from "../modelos/mueble.js";

//obtener todos los muebles
export const getMuebles = async (req: Request, res: Response)=>{
    try{
        const listaMuebles = await Mueble.findAll({ where:{esActivo: true}});
        res.json(listaMuebles);
    } catch (error){
        res.status(500).json({ msg: 'Ocurrio un error al consultar los muebles',error});
    }
};

//crear nuevo mueble
export const postMueble = async (req: Request, res: Response)=>{
    try{
        const { body } = req;
        await Mueble.create(body);
        res.json({ msg: `El mueble ${body.nombre_mueble} fue agregado con éxito`});
    } catch (error){
        res.status(400).json({ msg: 'Error al intentar guardar el mueble'});
    }
};

//editar datosespecificos del mueble
export const updateMueble = async (req: Request, res: Response) =>{
    const { id } = req.params;
    const { nombre_mueble, descripcion, precio, stockActual, stockMinimo,imagen, categoria_id} = req.body;

    if(!id){
        return res.status(400).json({ msg:"ID no proporcionado"});
    }
    
    const idNumber = parseInt(id as string);
    try{
        const mueble = await Mueble.findByPk(idNumber);

        if(mueble){
            await mueble.update({
                nombre_mueble, descripcion, precio, stockActual, stockMinimo,imagen, categoria_id
            });
            res.json({msg:'el mueble fue actualizado correctamente'});
        } else{
            res.status(404).json({msg:`No existe un mueble con el id ${id}`});
        }
    } catch (error){
        console.log(error);
        res.status(500).json({msg:'Error al actualizar el mueble', error});
    }

}

//eliminar mueble( cambiar activo a false)
export const deleteMueble = async (req: Request, res: Response) => {
    const { id } = req.params;

    if(!id){
        return res.status(400).json({ msg:"ID no proporcionado"});
    }
    
    const idNumber = parseInt(id as string);
    try{
        const mueble = await Mueble.findByPk(idNumber);
        if(mueble){
            //cambiamos el estado a false en lugar de borrarlo de la base de datos
            await mueble.update({ esActivo: false});
            res.json({msg:'el mueble fue desactivado correctamente'});
        } else {
            res.status(404).json({ msg:`no existe un mueble con el id ${id}`});
        } 
    }catch(error) {
        res.status(500).json({msg:'Error al intentar eliminar el mueble', error});
    }
    
};