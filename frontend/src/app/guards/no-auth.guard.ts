import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const noAuthGuard: CanActivateFn = () => {
    const router = inject(Router);
    const token = localStorage.getItem('token');

    if (token) {
        //tiene token puede acceder al home
        router.navigate(['/home']);
        return false;
    }
    //no tiene token, entonces lo redirigimos al login
    return true;
}