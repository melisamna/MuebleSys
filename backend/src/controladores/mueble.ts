import { type Request, type Response} from "express";
import { Mueble } from "../modelos/mueble.js";
import { Categoria } from "../modelos/categoria.js";
import { Sucursal } from "../modelos/sucursal.js";
import Message from "tedious/lib/message.js";


//obtener todos los muebles
export const getMuebles = async (req: Request, res: Response)=>{
    try{
        const listaMuebles = await Mueble.findAll({ where:{esActivo: true}, 
        include: [
        {model: Categoria, as: 'Categoria', attributes:['nombre_categoria']},
        { model: Sucursal, as:'Sucursal', attributes: ['direccion_sucursal', 'telefono_sucursal'], where: {esActivo: true}}
        ]
    });

        console.log('Muebles encontrados:',listaMuebles.length);
        res.json(listaMuebles);
        //para traer el nombre de la categoria
        
    } catch (error){
        console.error('error detallado', error)
        res.status(500).json({ msg: 'Ocurrio un error al consultar los muebles',error});
    }
};

//crear nuevo mueble
export const postMueble = async (req: Request, res: Response)=>{

    try{
        const {nombre_mueble, sucursal_id} = req.body;
        //validacion de seguridad en el servidor
        const existe = await Mueble.findOne({
            where: { 
                nombre_mueble: nombre_mueble, 
                sucursal_id: sucursal_id,
                esActivo: true
            }});
        //si existe, enviamos un error    
        if(existe){
            return res.status(400).json({msg: `Ya existe un mueble llamado "${nombre_mueble}" en esta sucursal`
            });
        }
        //si no existe, lo creamos
        const nuevoMueble =   await Mueble.create({
            ...req.body,
            esActivo: true
        });

        res.json({ msg: `El mueble ${nombre_mueble} fue agregado con éxito`,
        id: nuevoMueble.getDataValue('mueble_id')});

    } catch (error: any){
        console.error('error al guardar: ', error);
        res.status(500).json({ msg: 'Error al intentar guardar el mueble', error: error,Message});
    }
};

//editar datos especificos del mueble
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
    

    //obtener un solo mueble por id
 export const getMueble = async (req: Request, res: Response) => {
        const {id} = req.params;
        // convertimos el id a numero 
        const idNum = parseInt(id as string);
        try{
            const mueble = await Mueble.findByPk(idNum, {
                include: [
                {model: Categoria, as: 'Categoria', attributes:['nombre_categoria']},
                { model: Sucursal, as:'Sucursal', attributes: ['direccion_sucursal']}
                ]
            });

            if (mueble) {
                res.json(mueble);
            } else {
                res.status(404).json ({msg: `No existe un mueble con el id ${id}`});
            }
        } catch (error){
            console.error(error);
            res.status(500).json({msg: 'Error al obtener el mueble', error});
        }
    };

    //obtener los muebles desactivados
export const getPapelera = async (req: Request, res: Response)=>{
    try{
        const listaInactivos = await Mueble.findAll({ where:{esActivo: false}, 
        include: [
        {model: Categoria, as: 'Categoria', attributes:['nombre_categoria']},
        { model: Sucursal, as:'Sucursal', attributes: ['direccion_sucursal', 'telefono_sucursal'], where: {esActivo: true}}
        ]
    });

        console.log('Muebles encontrados:',listaInactivos.length);
        res.json(listaInactivos);
        //para traer el nombre de la categoria
        
    } catch (error){
        console.error('error detallado', error)
        res.status(500).json({ msg: 'Ocurrio un error al consultar la papeleria',error});
    }
};

//Restaurar un mueble (volver a activar)
export const restaurarMueble = async (req: Request, res:Response) => {
    const { id } = req.params;
    
    const idNumber = parseInt(id as string);
    try{
        const mueble = await Mueble.findByPk(idNumber);

        if(mueble){
            await mueble.update({esActivo: true});
            res.json({msg:'el mueble restaurado con éxito'});
        } else{
            res.status(404).json({msg:'No existe el mueble'});
        }
    } catch (error){
        res.status(500).json({msg:'Error al restaurar el mueble', error});
    }
};

//validar que un mueble con el mismo nombre y sucursal no se repita
export const verificarNombreMueble = async (req: Request, res: Response) => {
    //recibimos los datos
    const {nombre, sucursal_id} = req.query;
    try{
        const existe = await Mueble.findOne({
             where:{
                nombre_mueble: nombre,
                sucursal_id: sucursal_id
             }
        });
        //retorna true si existe o false si no
        res.json({existe: !!existe });
    }catch (error){
        res.status(500).json({msg:'Error al verificar'});
    }
}
