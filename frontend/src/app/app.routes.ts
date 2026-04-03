import { Routes } from '@angular/router';
import { LoginComponente } from './componentes/login/login.componente';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';
import { InventarioComponent } from './paginas/inventario/inventario.component';
import { CrearMuebleComponent } from './componentes/crear-mueble/crear-mueble.component';
import { PapeleraComponent } from './paginas/papelera/papelera.component';

export const routes: Routes = [
    // Esto fuerza a que si entras a localhost:4200 te mande a /login
    {path: '',redirectTo: 'login', pathMatch: 'full'},
    // si escribimos /login en la url, redirige al login
    { path: 'login', component: LoginComponente, canActivate: [noAuthGuard] },
    //ruta para despues del exito
    { path: 'home', loadComponent: () => import('./componentes/home/home.componente').then(m => m.HomeComponente), canActivate: [authGuard] },
        //ruta para ir al inventario
    {path: 'inventario', component:InventarioComponent, canActivate: [authGuard]},
    // ruta para agregat un nuevo mueble
    { path: 'crear', component: CrearMuebleComponent, canActivate: [authGuard]},
    // ruta para editar informacion de un mueble
    { path: 'editar/:id', component: CrearMuebleComponent, canActivate: [authGuard]},
    //ruta para ir a la papelera
    { path: 'papelera', component: PapeleraComponent, canActivate: [authGuard]},
    //si la ruta no existe, redirige al login
    {path: '**', redirectTo: 'login', pathMatch: 'full'}, 

];
