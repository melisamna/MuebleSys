import { type Request, type Response} from "express";
import { Sucursal } from "../modelos/sucursal.js";

export const getSucursales = async (req: Request, res: Response)=>{
    const listaSucursales = await Sucursal.findAll({
        where: {esActivo: true},
        attributes:['sucursal_id','direccion_sucursal']});
        res.json(listaSucursales);      
}