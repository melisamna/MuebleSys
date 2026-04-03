import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { Mueble } from '../modelos/mueble';

@Injectable({
  providedIn: 'root',
})
export class MuebleService {
  //Para que angular pueda pedir o mandar los datos
  private myAppUrl: string = 'http://localhost:3001';
  private myApiUrl: string = '/api/muebles';

  constructor(private http: HttpClient){}
    //Obtener todos los muebles
    getMuebles(): Observable<Mueble[]>{
      return this.http.get<Mueble[]>(`${this.myAppUrl}${this.myApiUrl}?t=${new Date().getTime()}`).pipe(
        tap(data => console.log('Respuesta del backend:', data)),
        catchError(err => {
        console.log('Status:', err.status);
        console.log('URL llamada:', err.url);
        console.log('Error detalle:', err.error);
        return throwError(() => err);    
        })
      );
    }

    // agregar un nuevo mueble
    saveMueble(mueble: Mueble): Observable<any>{
      return this.http.post(`${this.myAppUrl}${this.myApiUrl}`, mueble).pipe(
        tap(res => console.log('Servidor respondió:',res)),
        catchError(err => {
          console.error('Error al enviar el POST:',err);
          return throwError(() => err);
        })
      );
    }

    //editar informacion de un mueble
    getMueble(id:number):Observable<Mueble>{
      return this.http.get<Mueble>(`${this.myAppUrl}${this.myApiUrl}/${id}`)
    }

    updateMueble(id:number, mueble:Mueble): Observable<void>{
      return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}/${id}`, mueble);
    }

    //eliminar mueble (borrado logico o fisico por id)
    deleteMueble(id:number): Observable<any>{
      return this.http.delete(`${this.myAppUrl}${this.myApiUrl}/${id}`);
    }

    //obtener los muebles desactivados
    getPapelera(): Observable<Mueble[]> {
      return this.http.get<Mueble[]>(`${this.myAppUrl}${this.myApiUrl}/papelera`);
    }

    //restaurar mueble desactivado
    restaurarMueble(id: number): Observable<any> {
      return this.http.patch(`${this.myAppUrl}${this.myApiUrl}/restaurar/${id}`,{});
    }

    //obtener las categorias del back
    getCategorias(): Observable<any[]>{
      return this.http.get<any[]>(`${this.myAppUrl}/api/categorias`);
    }

        //obtener las sucursales del back
    getSucursales(): Observable<any[]>{
      return this.http.get<any[]>(`${this.myAppUrl}/api/sucursales`);
    }
  
    verificarNombre(nombre: string, sucursalId: number): Observable<{ existe: boolean }> {
      return this.http.get<{ existe: boolean }>(
        `${this.myAppUrl}${this.myApiUrl}/verificar-nombre?nombre=${nombre}&sucursal_id=${sucursalId}`
      );
    }
}
