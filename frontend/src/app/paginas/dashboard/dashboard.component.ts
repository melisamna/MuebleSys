import { Component, OnInit, ViewChild } from '@angular/core';
import { Notificacion } from '../../modelos/notificacion';
import { NotificacionService } from '../../servicios/notificacion.service';
import { CommonModule } from '@angular/common';
import { TarjetaNotificacion } from "../../componentes/tarjeta-notificacion/tarjeta-notificacion";
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { MuebleService } from '../../servicios/mueble.service';
import { Mueble } from '../../modelos/mueble';
import { AlertaService } from '../../servicios/alerta.servicio';
import { forkJoin } from 'rxjs';
import { registerLocaleData } from '@angular/common';
import localEs from '@angular/common/locales/es';
registerLocaleData(localEs);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TarjetaNotificacion, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})



export class DashboardComponent implements OnInit{
  listMuebles: Mueble[] = [];
  listNotis: Notificacion[] = [];
  listaInactivos: Mueble[] = [];
  misAlertas: Notificacion[] = [];
  today: number = Date.now();
  mueblesRecientes: Mueble[] = [];

@ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public doughnutChartLabels: string[] = [];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      { 
        data: [], 
        backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b'],
        hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf', '#dda20a', '#be2617']
      }
    ]
  };
  public doughnutChartType: ChartType = 'doughnut';
  
  constructor(private _muebleService: MuebleService,private _notificacionService: NotificacionService, private _alertaService: AlertaService) { }

  ngOnInit(): void {
    this._alertaService.loading('Cargando dashboard...');
    this._notificacionService.limpiarCache();
    
    forkJoin({
      muebles: this._muebleService.getMuebles(),
      inactivos: this._muebleService.getPapelera(),
      alertas: this._notificacionService.getNotificacion(),
      estadisticas: this._muebleService.getEstadisticas()
    }).subscribe({
      next: (data) => {
        this.listMuebles = data.muebles;
        this.mueblesRecientes = [...data.muebles].reverse().slice(0,3);
        
        this.listaInactivos = data.inactivos;
        this.misAlertas = data.alertas;
        this.cargarGrafica(data.estadisticas);
        this._alertaService.cerrarLoading();
      },
      error: () => {
        this._alertaService.error('Error al cargar el dashboard');
      }
    });
  }

  obtenerAlertas(){
    this._notificacionService.getNotificacion().subscribe({
      next: (data) => {
        this.misAlertas = data;
        this.listNotis = data;
      },
      error: (e) => console.error('Error al cargar alertas', e)
    });
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

  obtenerMueblesDesactivados(){
    this._muebleService.getPapelera().subscribe({
      next: (data) => {
        this.listaInactivos = data;
        console.log('se obtuvieron los muebles inactivos con exito');
      },
      error: (e) => console.error('Error al cargar la papelera', e)
    });
  }

  //esta seccion la marcará como leída
  atenderAlerta(id: number){
    this._notificacionService.marcarLeida(id).subscribe(() => {
      this.misAlertas = this.misAlertas.filter(a => a.notificacion_id !== id);
    });
  }

  cargarGrafica(data: any[]) {
      this.doughnutChartData ={
        labels: data.map((item: any) => item.nombre),
        datasets: [{
          data: data.map((item: any) => item.total),
        backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b'],
        hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf', '#dda20a', '#be2617']
        }]
      };
      setTimeout(() => this.chart?.update(), 0);
  }

}
