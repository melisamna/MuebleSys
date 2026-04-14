import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { Notificacion } from "../modelos/notificacion";

@Injectable({
  providedIn: 'root',
})

export class NotificacionService {
  //Para que angular pueda pedir o mandar los datos
  private myAppUrl: string = 'http://localhost:3001';
  private myApiUrl: string = '/api/notificaciones';

  private cacheNotificaciones: Notificacion[] | null = null;

  constructor(private http: HttpClient) {}

  // obtener las notificaciones activas (leida: false)
  getNotificacion(): Observable<Notificacion[]> {

    if(this.cacheNotificaciones){
      return of(this.cacheNotificaciones);
    }
    return this.http.get<Notificacion[]>(`${this.myAppUrl}${this.myApiUrl}`).pipe(
      tap(data => this. cacheNotificaciones = data)
    );
  }

  // marcar como leida usando el id
  marcarLeida(id: number): Observable<void> {
    return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}/${id}`,{}).pipe(
      //limpia el cache
      tap(() => this.cacheNotificaciones = null)
    );
  }

  limpiarCache(){
    this.cacheNotificaciones = null;
  }
}