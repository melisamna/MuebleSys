import { Component, OnInit, inject } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario.service';
import { CommonModule } from '@angular/common';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Router, RouterLink, RouterLinkActive } from '@angular/router'


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.componente.html',
  styleUrl: './header.componente.css',
})
export class HeaderComponente implements OnInit {
  private _usuarioService = inject(UsuarioService);
  private authService = inject(SocialAuthService);
  private router = inject(Router);
  datos: any;

  ngOnInit() {
    //escuchamos el megafono para actualizar el header cuando alguien inicie sesion
    this._usuarioService.$usuario$.subscribe({
      next: (usuario) => {
        this.datos = usuario;
        console.log("URL de la imagen", this.datos?.foto);

    if (this.datos) {
      //si se imprime algo, mira los nombres de las llaves
      console.log('header actualizado con exito:', this.datos.name || this.datos.nombre_usuario);
    } else {
      console.log('El header no detectó usuario');
    }
  },
  error: (err) =>
    console.error('Error al obtener el usuario en el header:', err)
  });
}

  onLogout() {
    //limpiamos los datos de nuestro servicio y localstorage
    this._usuarioService.logout();

    //cerramos la sesion tecnica de google
    this.authService.signOut().then(()=>{
      //una vez cerrado en google vamos al login
      this.router.navigate(['/login']);
    }).catch ((err)=>{
      //si ya estaba cerrado o da error igual redirigimos
      this.router.navigate(['/login']);
    })
  }

  onImgError(event:any){
    event.target.src ='https://ui-avatars.com/api/?name=User';
  }
}
