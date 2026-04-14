import { Component, OnInit } from '@angular/core';
import { MuebleService } from '../../servicios/mueble.service';
import { Mueble } from '../../modelos/mueble';
import { TablaMueblesComponent } from "../../componentes/tabla-muebles/tabla-muebles.component";
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { AlertaService } from '../../servicios/alerta.servicio';

@Component({
  selector: 'app-inventariot',
  standalone: true,
  imports: [CommonModule, TablaMueblesComponent, RouterLink],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css',
})
export class InventarioComponent implements OnInit{
  //aqui se guarda la lista de muebles que llegan del backend
  listMuebles: Mueble[] = [];
  mueblesFiltrados: Mueble[] = [];

  constructor(private _muebleService: MuebleService, private _alertasService: AlertaService){}

  ngOnInit(): void {
      this.obtenerMuebles();
  }

  obtenerMuebles(){
    this._alertasService.loading('Cargando inventario...');
    //aqui se usa la url http://localhost
    this._muebleService.getMuebles().subscribe({
      next: data =>{
      this.listMuebles = data;
      this.mueblesFiltrados = data;
      this._alertasService.cerrarLoading();
      }, 
      error: ()=> {
        this._alertasService.error('Error al cargar muebles:')
      } 
    });
  }

    filtrarMuebles(event:any){
    const filtro = event.target.value.toLowerCase();

    this.mueblesFiltrados = this.listMuebles.filter(mueble =>
      mueble.nombre_mueble.toLowerCase().includes(filtro) ||
      mueble.descripcion?.toLocaleLowerCase().includes(filtro)
    );
  }

  
  async eliminarMuebles(id: number){
    const confirmado = await this._alertasService.confirmar(
      'Este mueble será desactivado del inventario'
    );
    if (confirmado){
      this._muebleService.deleteMueble(id).subscribe({
        next: () =>{
          this.listMuebles = this.listMuebles.filter(m => m.mueble_id !== id);
          this.mueblesFiltrados = this.mueblesFiltrados.filter(m => m.mueble_id !== id);
          this._alertasService.exito('Mueble desactivado correctamente');
          console.log('Mueble desactivado con éxito');
        },
        error: (err) => {
          this._alertasService.error('No se pudo desactivar el mueble');
          console.error('Error al desactivar', err);
        }
      });
    }
  }

}
