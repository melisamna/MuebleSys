import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Mueble } from '../../modelos/mueble';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-tabla-muebles',
  imports: [CommonModule, RouterLink],
  templateUrl: './tabla-muebles.component.html',
  styleUrl: './tabla-muebles.component.css',
})
export class TablaMueblesComponent {

  //la tabla recibe los datos desde la pagina
  @Input() muebles: Mueble[] =[];
  //avisamos a la pagina cuando queremos eliminar algo
  @Output() eliminar = new EventEmitter<number>();

  onEliminar(id: number | undefined){
    if (id){
      this.eliminar.emit(id);
    }
  }
}
