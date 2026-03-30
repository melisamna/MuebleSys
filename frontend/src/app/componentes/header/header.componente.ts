import { Component, OnInit, inject } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.componente.html',
  styleUrl: './header.componente.css',
})
export class HeaderComponente implements OnInit {
  private _usuarioService = inject(UsuarioService);
  datos: any;

  ngOnInit() {
    //escuchamos el megafono para actualizar el header cuando alguien inicie sesion
    this._usuarioService.$usuario$.subscribe({
      next: (usuario) => {
        this.datos = usuario;

    if (this.datos) {
      //si se imprime algo, mira los nombres de las llaves
      console.log('header actualizado con exito:', this.datos.name || this.datos.nombre);
    } else {
      console.log('El header no detectó usuario');
    }
  },
  error: (err) =>
    console.error('Error al obtener el usuario en el header:', err)
  });
}

  onLogout() {
    this._usuarioService.logout();
  }
}
