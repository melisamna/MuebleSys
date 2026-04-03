import { type Request, type Response} from "express";
import { Categoria } from "../modelos/categoria.js";

export const getCategorias = async (req: Request, res: Response)=>{
    const listaCategorias = await Categoria.findAll({
        attributes:['categoria_id','nombre_categoria']});
        res.json(listaCategorias);      
}
