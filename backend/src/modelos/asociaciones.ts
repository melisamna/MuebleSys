import { Mueble } from "./mueble.js";
import { Categoria } from "./categoria.js";
import { Sucursal } from "./sucursal.js";
import { Notificacion } from "./notificacion.js";

// para hacer inner join
export const configurarAsociasiones = () =>{
    // relacion para la tabla mueble y categoria
    Mueble.belongsTo(Categoria,{
        //el campo de id en categoria
        foreignKey: 'categoria_id',
        //el campo de id en la tabbla
        targetKey: 'categoria_id',
        as: 'Categoria'
    });
    // relacion para la tabla mueble y sucursal
    Mueble.belongsTo(Sucursal,{
        //el campo de id en categoria
        foreignKey: 'sucursal_id',
        //el campo de id en la tabbla
        targetKey: 'sucursal_id',
        as: 'Sucursal'
    });
    // Aquí estableces la relación
    Notificacion.belongsTo(Mueble, {
        foreignKey: 'mueble_id' 
    });
    Mueble.hasMany(Notificacion, {
        foreignKey: 'mueble_id' 
    });
    
    console.log('Asociaciones de base de datos cargadas.')

}