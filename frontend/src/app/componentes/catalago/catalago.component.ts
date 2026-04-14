import { Component, OnInit } from '@angular/core';
import { MuebleService } from '../../servicios/mueble.service';
import { Mueble } from '../../modelos/mueble';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-catalago',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalago.component.html',
  styleUrl: './catalago.component.css',
})
export class CatalagoComponent implements OnInit {
  
  listaMuebles: Mueble [] = [];
  mueblesFiltrados: Mueble[] = [];
  listaCategorias: any[] = [];
  readonly URL_IMAGEN = 'http://localhost:3001/public/';


  //variables de busqeuda
  textoBusqueda: string = '';
  categoriaSeleccionada: string = '';
  precioMaximo: number = 0;

  constructor(private _muebleService: MuebleService){ }

  ngOnInit(): void {
      this.obtenerMuebles();
      this.obtenerCategorias();
  }

  obtenerCategorias() {
    this._muebleService.getCategorias().subscribe({
      next: (data) => {
        this.listaCategorias = data;
        console.log('Categorías para el filtro:', data);
      },
      error: (err) => console.error('Error al traer categorías:', err)
    });
  }

  obtenerMuebles(){
    this._muebleService.getMuebles().subscribe(data =>{
      this.listaMuebles = data.filter(m => m.esActivo && m.stockActual  > 0);
      this.mueblesFiltrados = this.listaMuebles;
    });
  }

  filtrarMuebles(){
    this.mueblesFiltrados = this.listaMuebles.filter(mueble => {
      //material o descripcion
      const busqueda = this.textoBusqueda.toLowerCase();
      const coincideNombre = mueble.nombre_mueble.toLowerCase().includes(busqueda) ||
                             mueble.descripcion?.toLowerCase().includes(busqueda);

      //categoria
      const coincideCat = this.categoriaSeleccionada === '' || 
                    mueble.Categoria?.nombre_categoria === this.categoriaSeleccionada;
      //Rango de Precio
      const coincidePrecio = this.precioMaximo <= 0 || 
                             mueble.precio <= this.precioMaximo;

      return coincideNombre && coincideCat && coincidePrecio;
  });
  }

}
