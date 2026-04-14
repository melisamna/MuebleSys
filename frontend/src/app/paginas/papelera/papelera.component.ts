import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MuebleService } from '../../servicios/mueble.service';
import { Mueble } from '../../modelos/mueble';
import { AlertaService } from '../../servicios/alerta.servicio';

@Component({
  selector: 'app-papelera',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './papelera.component.html',
  styleUrl: './papelera.component.css',
})

export class PapeleraComponent implements OnInit{
  listaInactivos: Mueble[]=[];

  //el constructor recibe el servicio para interactuar con el back
  constructor(private _muebleService: MuebleService, private _alertaService: AlertaService){}

  ngOnInit(): void {
      this.obtenerMueblesDesactivados();
  }

  obtenerMueblesDesactivados(){
    this._alertaService.loading('Cargando papelera...');
    this._muebleService.getPapelera().subscribe({
      next: (data) => {
        this.listaInactivos = data;
        this._alertaService.cerrarLoading();
        console.log('se obtuvieron los muebles inactivos con exito');
      },
      error: () => {
        this._alertaService.error('Error al cargar la papelera');
      }
    });
  }

  //boton para restaurar
  async onRestaurar(id: number | undefined){
    if(!id) return;

    const confirmado = await this._alertaService.confirmarRestaurar(
      'Este mueble volverá aparecer en el inventario'
    );

    if(confirmado){
    this._muebleService.restaurarMueble(id).subscribe({
      next: () => {
        this.listaInactivos = this.listaInactivos.filter(m => m.mueble_id !== id);
        this._alertaService.exito('Mueble restaurado correctamente');
      },
      error: () => {
        this._alertaService.error('No se pudo restaurar el mueble');
      }
    });
    }
  }
}
