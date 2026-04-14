import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    
    { 
        path: 'login', 
        loadComponent: () => import('./componentes/login/login.componente').then(m => m.LoginComponente), 
        canActivate: [noAuthGuard] 
    },
    { 
        path: 'home', 
        loadComponent: () => import('./componentes/home/home.componente').then(m => m.HomeComponente), 
        canActivate: [authGuard] 
    },
    { 
        path: 'inventario', 
        loadComponent: () => import('./paginas/inventario/inventario.component').then(m => m.InventarioComponent), 
        canActivate: [authGuard] 
    },
    { 
        path: 'crear', 
        loadComponent: () => import('./componentes/crear-mueble/crear-mueble.component').then(m => m.CrearMuebleComponent), 
        canActivate: [authGuard] 
    },
    { 
        path: 'editar/:id', 
        loadComponent: () => import('./componentes/crear-mueble/crear-mueble.component').then(m => m.CrearMuebleComponent), 
        canActivate: [authGuard] 
    },
    { 
        path: 'papelera', 
        loadComponent: () => import('./paginas/papelera/papelera.component').then(m => m.PapeleraComponent), 
        canActivate: [authGuard] 
    },
    { 
        path: 'catalogo', 
        loadComponent: () => import('./componentes/catalago/catalago.component').then(m => m.CatalagoComponent), 
        canActivate: [authGuard] 
    },

    { path: '**', redirectTo: 'login', pathMatch: 'full' },
];