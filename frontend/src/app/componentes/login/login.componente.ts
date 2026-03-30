import { Component, inject, OnInit, runInInjectionContext, Injector } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { GoogleSigninButtonModule, SocialAuthService, SocialLoginModule} from '@abacritt/angularx-social-login';
import { UsuarioService } from '../../servicios/usuario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,RouterModule,GoogleSigninButtonModule],
  templateUrl: './login.componente.html',
  styleUrl: './login.componente.css',
})

export class LoginComponente implements OnInit {

    constructor(
      private authService: SocialAuthService,
      private _usuarioService: UsuarioService,
      private router: Router
    ) {}

  ngOnInit() { 
    // Escuchamos a google 
    // cuando el usuario se loguea, google nos manda sus datos
    this.authService.authState.subscribe((userGoogle) => {

      if (userGoogle && userGoogle.idToken) {
        // Enviamos el token de google al backend para que lo valide y nos devuelva un token de MuebleSys
        this._usuarioService.loginConGoogle(userGoogle.idToken).subscribe({
          next: (res) => {
            // Guardamos el token de MuebleSys en el localStorage para usarlo en futuras peticiones al backend
            localStorage.setItem('token', res.token);
            //usamos el metodo del servicio
            this._usuarioService.establecerUsuario(userGoogle);

            // Redirigimos al usuario a la página principal después de iniciar sesión
            console.log('Login exitoso, redirigiendo...', userGoogle);
            //redirimos a home
            this.router.navigate(['/home']);
          },
          error: (err) => {
            console.error('Error al iniciar sesión con Google:', err)
          }
    });
  } else{
        console.warn('No se recibió un token de Google. El usuario no se pudo autenticar.');
  }
    });
  }
}
