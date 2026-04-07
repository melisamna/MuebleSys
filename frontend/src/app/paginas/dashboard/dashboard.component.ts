import { Component, OnInit } from '@angular/core';
import { Notificacion } from '../../modelos/notificacion';
import { NotificacionService } from '../../servicios/notificacion.service';
import { CommonModule } from '@angular/common';
import { TarjetaNotificacion } from "../../componentes/tarjeta-notificacion/tarjeta-notificacion";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TarjetaNotificacion, ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit{
  misAlertas: Notificacion[] = [];

  constructor(private _notificacionService: NotificacionService) { }

  ngOnInit(): void {
      this.obtenerAlertas();
  }

  obtenerAlertas(){
    this._notificacionService.getNotificacion().subscribe({
      next: (data) => {
        this.misAlertas = data;
      },
      error: (e) => console.error('Error al cargar alertas', e)
    });
  }

  //esta seccion la marcará como leída
  atenderAlerta(id: number){
    this._notificacionService.marcarLeida(id).subscribe(() => {
      this.obtenerAlertas();
      console.log('Stock revisado y alerta activada');
    })
  }

}
