import { HttpInterceptorFn } from "@angular/common/http";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    //sacamos el token del localStorage
    const token = localStorage.getItem("token");

    //si el token existe, clonamos la petición y le añadimos el token en el header
    if (token) {
    const clonado = req.clone({
        setHeaders:{
            Authorization: `Bearer ${token}`
        }
    });
    // enviamos la peticion clonada con el token
        return next(clonado);
    }
    // si no hay token, enviamos la petición original
    return next(req);
};