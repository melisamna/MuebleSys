import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})

export class UsuarioService {
 //inyeccion de dependencias
  private http = inject(HttpClient);
  //inyeccion de dependencias para el router
  private router = inject(Router);
  //sirve como megafono  para comunicar cambios en el usuario a otros componentes que lo necesiten, como el header
  private usuarioSubject = new BehaviorSubject<any>(this.obtenerUsuarioActual());

  //este es el que los componentes van a escuchar para actualizarse cuando el usuario cambie (login/logout)
  $usuario$ = this.usuarioSubject.asObservable();

  //Asegurarse que el puerto coincida con el del backend
  private myAppUrl: string = 'http://localhost:3001';
  private myApiUrl: string = '/api/usuarios';

  constructor() { }

  //metodo para enviar el token de google al backend y obtener el token de MuebleSys
  loginConGoogle(token: string): Observable<any> {
    // enviamos un objeto con la propiedad token como espera el backend
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}/login-google`, { token }).pipe(
      tap((res: any) => {
        //guardamos el token de MuebleSys en el localStorage
        localStorage.setItem('token', res.token);
        //guardamos la informacion del usuario (nombre, correo) que viene del backend
        localStorage.setItem('usuario', JSON.stringify(res.usuario));

        //avisar al megafono con los datos nuevos
        this.usuarioSubject.next(res.usuario);
      })
    );
  }

  //obtener datos para el header
  obtenerUsuarioActual(){
    const data = localStorage.getItem('usuario');
    if(!data || data === 'undefined') return null;
    try {
      return JSON.parse(data);
    }catch{
      return null;
    }
  }

  //metodo para avisar a todos los componentes que alguien inicio sesion
  establecerUsuario(usuario: any){
    localStorage.setItem('usuario', JSON.stringify(usuario));
    //aqui avisamos al megafono
    this.usuarioSubject.next(usuario);
  }

  //metodo para cerrar sesion
  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.usuarioSubject.next(null);
    console.log('Usuario deslogueado de MuebleSys');
    this.router.navigate(['/login']);
  }

  //verificacion para el authguard
  isLoggedIn(): boolean {
  return !!localStorage.getItem('token');
  }
}
