import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const token = localStorage.getItem('token');

    if (!token) {
    router.navigate(['/login']);
    return false;
    }
    try{
        const payload = JSON.parse(atob(token.split('.')[1]));
        const ahora = Math.floor(Date.now() / 1000);

        if (payload.exp && payload.exp < ahora){
            //token expirado
            console.log('Token expirado, redirigiendo al login...');
            localStorage.removeItem('token');
            router.navigate(['/login']);
            return false;
        }
        return true;
    }catch (e) {
        //token malformado
        localStorage.removeItem('token');
        router.navigate(['/login']);
        return false;
    }
};