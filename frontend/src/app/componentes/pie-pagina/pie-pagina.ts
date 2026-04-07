import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pie-pagina',
  templateUrl: './pie-pagina.html',
  standalone: true,
  imports: [RouterLink],
  styleUrls: ['./pie-pagina.scss']
})
export class PiePaginaComponent {
  anio = new Date().getFullYear();
}
