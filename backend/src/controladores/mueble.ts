import { type Request, type Response} from "express";
import { Mueble } from "../modelos/mueble.js";
import { Categoria } from "../modelos/categoria.js";
import { Sucursal } from "../modelos/sucursal.js";
import Message from "tedious/lib/message.js";
import { enviarAlertaStock } from '../servicios/email.service.js';
import { Notificacion } from "../modelos/notificacion.js";
import { Sequelize } from "sequelize";
import fs from 'fs';
import path from "path";
import { MuebleView } from "../modelos/muebleView.js";

const verificarCrearNotificacion = async (mueble: any) => {
    if (mueble.stockActual <= mueble.stockMinimo) {
        const alertaExistente = await Notificacion.findOne({
            where: { mueble_id: mueble.mueble_id, leida: false}
        });

        if (!alertaExistente) {
            await Notificacion.create({
                mensaje: `El mueble "${mueble.nombre_mueble}"tiene stock bajo (${mueble.stockActual} unidades)."`,
                tipo: 'STOCK_BAJO',
                mueble_id: mueble.mueble_id,
                sucursal_id: mueble.sucursal_id,
                leida: false,
                fecha_creacion: Sequelize.fn('GETDATE')
            })
            console.log(`Notificacion generada para: ${mueble.nombre_mueble}`);
            //Enviamos el correo de notificacion
            await enviarAlertaStock(mueble.nombre_mueble, mueble.stockActual);
        }
    }
}
//obtener todos los muebles
export const getMuebles = async (req: Request, res: Response)=>{
    try{
        const listaMuebles = await MuebleView.findAll({
        where: {
            esActivo: true,
            sucursal_activa: true
        }
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

        //obtener el nombre del archivo que genero multer
        const nombreImagen = req.file ? req.file.filename : '';
        //si no existe, lo creamos
        const nuevoMueble =   await Mueble.create({
            ...req.body,
            //se guarda el archivo en la columna imagen
            imagen: nombreImagen,
            esActivo: true
        });

        await verificarCrearNotificacion(nuevoMueble);

        res.json({ msg: `El mueble ${nombre_mueble} fue agregado con éxito`,
        id: nuevoMueble.getDataValue('mueble_id')});

    } catch (error: any){
        console.error('error al guardar: ', error);
        res.status(500).json({ msg: 'Error al intentar guardar el mueble', error: error,Message});
    }
};

//editar datos especificos del mueble
export const updateMueble = async (req: Request, res: Response) =>{
    console.log('datos recibidos en el body:', req.body);
    console.log('id recibido en params:', req.params.id);
    
    const { id } = req.params;
    const { nombre_mueble, descripcion, precio, stockActual, stockMinimo, categoria_id, imagen} = req.body;

    if(!id){
        return res.status(400).json({ msg:"ID no proporcionado"});
    }
    
    const idNumber = parseInt(id as string);
    try{
        const mueble = await Mueble.findByPk(idNumber);

        if(mueble){
            let nombreImagenFinal = mueble.getDataValue('imagen');

            if (req.file){
                //si el usuario subio una nueva foto
                nombreImagenFinal = req.file.filename;

                //borrar la imagen anterior de la carpeta galeria
                const imagenVieja = mueble.getDataValue('imagen');
                if (imagenVieja){
                    const pathViejo = path.resolve(`galeria/${imagenVieja}`);
                    if (fs.existsSync(pathViejo)) {
                        fs.unlinkSync(pathViejo);
                    }
                }
            }

            // actualizar el registro
            await mueble.update({
                nombre_mueble, descripcion, precio, stockActual, stockMinimo, categoria_id,imagen: nombreImagenFinal
            });
            
            await verificarCrearNotificacion(mueble);

            res.json({msg:'el mueble fue actualizado correctamente'});
        } else{
            res.status(404).json({msg:`No existe un mueble con el id ${id}`});
        }
    } catch (error){
        console.log(error);
        res.status(500).json({msg:'Error al actualizar el mueble', error});
    }

};

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
        const listaInactivos = await MuebleView.findAll({
        where: {
            esActivo: false,
            sucursal_activa: true
        }
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

export const getEstadisticasCategorias = async (req: Request, res: Response) => {
    try {
        const estadisticas = await Mueble.findAll({
            where: { esActivo: true },
            attributes: [
                [Sequelize.fn('COUNT', Sequelize.col('mueble_id')), 'total'],
                [Sequelize.col('Categoria.nombre_categoria'), 'nombre']
            ],
            include: [{
                model: Categoria,
                as: 'Categoria',
                attributes: []
            }],
            group: ['Categoria.nombre_categoria'],
            raw: true
        });
        res.json(estadisticas);
    } catch (error: any) {
        console.error("Error en el servidor:", error.message);
        res.status(500).json({ msg: 'Error al generar estadísticas' });
    }
};

