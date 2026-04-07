import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Notificacion } from "../modelos/notificacion";

@Injectable({
  providedIn: 'root',
})

export class NotificacionService {
  //Para que angular pueda pedir o mandar los datos
  private myAppUrl: string = 'http://localhost:3001';
  private myApiUrl: string = '/api/notificaciones';

  constructor(private http: HttpClient) {}

  // obtener las notificaciones activas (leida: false)
  getNotificacion(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }

  // marcar como leida usando el id
  marcarLeida(id: number): Observable<void> {
    return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}${id}`,{})
  }
}