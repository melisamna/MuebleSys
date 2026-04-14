import { Injectable } from "@angular/core";
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class AlertaService {

    //mensaje de exito
    exito(mensaje: string){
        Swal.fire({
            title: '!Exito!',
            text: mensaje,
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true
        });
    }

    //mensaje de error
    error(mensaje: string){
        Swal.fire({
            title: 'Ocurrio un error',
            text: mensaje,
        });
    }

    confirmar(mensaje: string): Promise<boolean>{
        return Swal.fire({
            title: '¿Estás seguro?',
            text: mensaje,
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar'
        }). then(result => result.isConfirmed);
    }

    confirmarRestaurar(mensaje: string): Promise<boolean>{
        return Swal.fire({
            title: '¿Restaurar?',
            text: mensaje,
            showCancelButton: true,
            confirmButtonColor: "#1cc88a",
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Si, restaurar',
            cancelButtonText: 'Cancelar'
        }). then(result => result.isConfirmed);
    }

    advertencia(mensaje: string){
        Swal.fire({
            title: 'Atención',
            text: mensaje,
        });
    }

    loading(mensaje: string = 'Cargando...'){
        Swal.fire({
            title: mensaje,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    }

    cerrarLoading() {
        Swal.close();
    }
}