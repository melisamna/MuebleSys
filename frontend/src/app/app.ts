import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponente } from "./componentes/header/header.componente";
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponente, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App implements OnInit {
  router = inject(Router);
  mostrarHeader: boolean = true;

  ngOnInit(): void {
      // escuchamos los cambios de ruta para ocultar el header en el login
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: any) => {
        // si la ruta NO es /login, ocultamos el header, sino lo mostramos
        this.mostrarHeader = !(event.url.includes('/login'));
      });
  }
  
}
