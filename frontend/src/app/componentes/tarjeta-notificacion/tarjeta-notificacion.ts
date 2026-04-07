import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notificacion } from '../../modelos/notificacion';

@Component({
  selector: 'app-tarjeta-notificacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tarjeta-notificacion.html',
  styleUrl: './tarjeta-notificacion.css',
})
export class TarjetaNotificacion {
  //recibimos la notificacion
  @Input() alerta!: Notificacion;

  //enviamos el id al dashboard cuando se haga clic en el boton
  @Output() accionRevisado = new EventEmitter<number>();

  marcarRevisado() {
    this.accionRevisado.emit(this.alerta.notificacion_id);
  }
}
