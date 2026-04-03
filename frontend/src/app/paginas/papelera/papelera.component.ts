import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MuebleService } from '../../servicios/mueble.service';
import { Mueble } from '../../modelos/mueble';

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
  constructor(private _muebleService: MuebleService){}

  ngOnInit(): void {
      this.obtenerMueblesDesactivados();
  }

  obtenerMueblesDesactivados(){
    this._muebleService.getPapelera().subscribe({
      next: (data) => {
        this.listaInactivos = data;
        console.log('se obtuvieron los muebles inactivos con exito');
      },
      error: (e) => console.error('Error al cargar la papelera', e)
    });
  }

  //boton para restaurar
  onRestaurar(id: number | undefined){
    if(id){
    this._muebleService.restaurarMueble(id).subscribe({
      next: (res) => {
        console.log(res.msg);

        //para refrescar la lista
        this.obtenerMueblesDesactivados();
      },
      error: (e) => console.error('Error al restaurar', e)
    });
    }
  }
}
