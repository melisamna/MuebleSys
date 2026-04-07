export interface Notificacion {
    notificacion_id?: number;
    mensaje: string;
    tipo: string;
    leida: boolean;
    mueble_id?: number;
    sucursal_id?: number;
    fecha_creacion?: Date;
}