import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../../paginas/dashboard/dashboard.component';

@Component({
  selector: 'app-home.componente',
  standalone: true,
  imports: [CommonModule, DashboardComponent],
  templateUrl: './home.componente.html',
  styleUrl: './home.componente.css',
})
export class HomeComponente {

}
