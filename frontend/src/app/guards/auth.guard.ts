import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const token = localStorage.getItem('token');

    if (token) {
        //tiene token puede acceder
        return true;
    }
    router.navigate(['/login']);
    return false;
}