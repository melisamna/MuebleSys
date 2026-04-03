import { HttpInterceptorFn, HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";

//Se encarga de adjuntar el token a las peticiones
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    //sacamos el token del localStorage
    const token = localStorage.getItem("token");

    //variable para almacenar la peticion (original)
    let peticion = req;

    //si el token existe, clonamos la petición y le añadimos el token en el header
    if (token) {
    peticion = req.clone({
        setHeaders:{
            Authorization: `Bearer ${token}`
        }
    });
}

    return next(peticion).pipe(
        catchError((error: HttpErrorResponse) => {
            //si el backend manda 401 (No autorizado/sesión expirada)
            if(error.status === 401){
                console.log('Sesion expirada. Redirigiendo al login...');
                //eliminamos el token para evitar bucles
                localStorage.removeItem("token");
                //redirigimos al usuario al login
                router.navigate(['/login']).then(
                    nav => {
                        if(nav){
                            console.log('Navegacion exitosa');
                        } else{
                            console.log('Fallo la navegacion');
                        }
                    }
                )
            }
            return throwError(() => error);
        })
    );
};
