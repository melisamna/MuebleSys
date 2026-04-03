import { Component, OnInit, inject, HostListener } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponente } from "./componentes/header/header.componente";
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponente, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App implements OnInit {
  router = inject(Router);
  mostrarHeader: boolean = false;

  //configuracion de inactividad
  timeoutId:any;
  // Aqui son 30 minutos
  //tiempoLimite = 10 * 1000;
  tiempoLimite = 30 * 60 * 1000;

  ngOnInit(): void {
    
      // escuchamos los cambios de ruta para ocultar el header en el login
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: any) => {
        // si la ruta NO es /login, ocultamos el header, sino lo mostramos
        this.mostrarHeader = !(event.url.includes('/login') || event.url === '/' || event.url === '');

        //manejo del temporizador segun la ruta
        if (event.url.includes('/login')){
          this.detenerTemporizador();
        } else {
          this.iniciarTemporizador();
        }
      });

      //metodo que revisa cada 5 minutos si el token ya esxpiró
setInterval(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const ahora = Math.floor(Date.now() / 1000);

            if (payload.exp < ahora) {
                console.warn('Token JWT expirado, cerrando sesión...');
                this.cerrarSesion();
            }
        } catch {
            this.cerrarSesion();
        }
    }, 5000);
  }


  //---------LOGICA PARA DETECCION DE ACTIVIDAD

    @HostListener('window:mousemove')
    @HostListener('window:mousedown')
    @HostListener('window:keypress')
    @HostListener('window:scroll')
    
    resetTimer(){
      //Solo reiniciamos si el usuario está logueado (hay header visible)
      if (this.mostrarHeader){
        this.detenerTemporizador();
        this.iniciarTemporizador();
      }
    }
    
    iniciarTemporizador(){
      //solo iniciamos temporizador si existe un token
      if (localStorage.getItem('token')){
        this.timeoutId = setTimeout(() =>{
          this.cerrarSesion();
        },this.tiempoLimite);
      }
    }

    detenerTemporizador(){
      if (this.timeoutId){
        clearTimeout(this.timeoutId);
      }
    }

    private authService = inject(SocialAuthService);

    cerrarSesion(){
      console.warn("sesión expirada tras 30 minutos de inactividad");
      localStorage.removeItem('token');
      this.authService.signOut().finally(()=>{
        this.router.navigate(['/login']);
      })
    }
  
}
