import { Component, OnInit } from '@angular/core';
import { MuebleService } from '../../servicios/mueble.service';
import { Mueble } from '../../modelos/mueble';
import { TablaMueblesComponent } from "../../componentes/tabla-muebles/tabla-muebles.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventariot',
  standalone: true,
  imports: [CommonModule, TablaMueblesComponent],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css',
})
export class InventarioComponent implements OnInit{
  //aqui se guarda la lista de muebles que llegan del backend
  listMuebles: Mueble[] =[];

  constructor(private _muebleService: MuebleService){}

  ngOnInit(): void {
      this.obtenerMuebles();
  }

  obtenerMuebles(){
    //aqui se usa la url http://localhost
    this._muebleService.getMuebles().subscribe({
      next: data =>{
      this.listMuebles = data;
      console.log('Muebles cargados: ', data);
      }, 
      error: (err)=> {
        console.error('Error al cargar muebles:', err)
      } 
    });
  }

  
  eliminarMuebles(id: number){
    if (confirm('¿Estas seguro de que quieres desactivar este mueble?')){
      this._muebleService.deleteMueble(id).subscribe({
        next: () =>{
          //actualizamos la tabla
          this.obtenerMuebles();

          console.log('Mueble desactivado con éxito');
        },
        error: (err) => {
          console.error('Error al desactivar', err);
        }
      });
    }
  }

}
