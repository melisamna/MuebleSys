
export interface Mueble {
    mueble_id?: number;
    categoria_id: number;
    sucursal_id: number;
    nombre_mueble: string;
    descripcion?: string;
    precio: number;
    imagen?: string;
    stockActual: number;
    stockMinimo: number;
    esActivo?: boolean;
    fechaCreacion?: Date;

    Categoria?: {
        nombre_categoria: string;
    };
    Sucursal?:{
        direccion: string;
        telefono: string;
    }
}