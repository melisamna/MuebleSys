import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { MuebleService } from '../../servicios/mueble.service';
import { Mueble } from '../../modelos/mueble';
import { CommonModule } from '@angular/common';
import { Categoria } from '../../modelos/categoria';
import { Sucursal } from '../../modelos/sucursal';
import { map,catchError, delay, of } from 'rxjs';
import { AlertaService } from '../../servicios/alerta.servicio';


@Component({
  selector: 'app-crear-mueble',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, RouterModule],
  templateUrl: './crear-mueble.component.html',
  styleUrl: './crear-mueble.component.css',
})
export class CrearMuebleComponent implements OnInit{
  
  listaCategorias: Categoria[] =[];
  listaSucursales: Sucursal[] = [];
  form: FormGroup;
  id: number;
  operacion: string = 'Agregar';

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor (
    private fb:FormBuilder,
    private _muebleService: MuebleService,
    private router: Router,
    private aRoute: ActivatedRoute,
    private _alertaService: AlertaService
  ){ 
      this.form = this.fb.group({
      nombre_mueble: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['',Validators.required],
      precio: [null, [Validators.required, Validators.min(0.01)]],
      stockActual: [null, [Validators.required, Validators.min(0)]],
      stockMinimo: [1, [Validators.required, Validators.min(0)]],
      categoria_id: [null, Validators.required],
      sucursal_id:[null, Validators.required],
      esActivo: [true],
      imagen: ['']
    });
    //Capturamos el id de la ruta par ver si es editar o crear
    this.id = Number(this.aRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.cargarSelects();
    //escuchamos en la sucursal para re-validar el nombre
    this.form.get('sucursal_id')?.valueChanges.subscribe(() => {
      //esto have que si cambias la sucursal el validador del nombre se dispare otra vez
      this.form.get('nombre_mueble')?.updateValueAndValidity();
    })
    //si el id es diferente de 0, significa que vamos a editar
    if(this.id !== 0){
      this.operacion = 'Editar';
      this.obtenerMueble(this.id);
    }
  }

  cargarSelects(){
    console.log(' intentando cargar')
    this._muebleService.getCategorias().subscribe({
      next: (data) => {
        console.log('Categorias recibidas:', data);
        this.listaCategorias = data;
      },
      error: (err) => console.error('Error en categorias:',err)
    });

    this._muebleService.getSucursales().subscribe({
      next: (data) => {
        console.log('Sucursales recibidas:',data);
        this.listaSucursales = data;
       }, 
        error: (err) => console.error('Error en sucursales', err)
      });
  }

  obtenerMueble(id: number){
    this._muebleService.getMueble(id).subscribe((data: Mueble) =>{
      // cargamos los datos en el formulario
      this.form.patchValue({
      nombre_mueble: data.nombre_mueble,
      descripcion: data.descripcion,
      precio: data.precio,
      stockActual: data.stockActual,
      stockMinimo: data.stockMinimo,
      categoria_id: data.categoria_id,
      sucursal_id: data.sucursal_id,
      esActivo: data.esActivo,
      imagen: data.imagen
    });
    //bloquear estos campos para no modificar en edicion
    //this.form.get('nombre_mueble')?.disable();
    //this.form.get('descripcion')?.disable();
    //this.form.get('categoria_id')?.disable();
    //this.form.get('sucursal_id')?.disable();
    });
  }

  //metodo para caprurar el archivo cuando el usuario lo selecciona (imagen)
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if(file){
      this.selectedFile = file;

      //generar previsualizacion
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  agregarMueble(){
    //si el formulario es invalido  se cota la ejecucion
    if(this.form.invalid) return;

    // usamos formData para poder enviar el archivo al servidor
    const formData = new FormData();
    //extraemos todos loa valores incluyendo los bloqueados
    const values = this.form.getRawValue();

    // creamos el objeto basado en los valores del formulario
      formData.append('nombre_mueble', values.nombre_mueble);
      formData.append('descripcion' ,values.descripcion);
      formData.append('precio', values.precio);
      formData.append('stockActual', values.stockActual);
      formData.append('stockMinimo', values.stockMinimo);
      formData.append('categoria_id', values.categoria_id);
      formData.append('sucursal_id', values.sucursal_id);
      formData.append('esActivo','1');

    //si hay foto la agregamos
    if (this.selectedFile){
      formData.append('imagen', this.selectedFile, this.selectedFile.name);
    }

    if (this.id !==0){
      //Logica para EDITAR
      this._muebleService.updateMueble(this.id, formData).subscribe({
        next: () => {
          this._alertaService.exito('Mueble actualizado con éxito');
          setTimeout(() => this.router.navigate(['/inventario']), 2000);
        },
        error: (e) => {
          this._alertaService.error('No se pudo actualizar el mueble');
        }
      });
    } else {
      //Lógica para crear
    this._muebleService.saveMueble(formData).subscribe({
      next: () =>{
        this._alertaService.exito(`El mueble ${values.nombre_mueble} fue registrado`);
        setTimeout(() => this.router.navigate(['/inventario']), 2000);
      },
      error: (err) => {
        //si el backend responde con un error 400 
        if(err.status === 400){
          //muestra el mensaje de que ya existe
          this._alertaService.advertencia(err.error.msg);
        } else {
          this._alertaService.error('Algo salió mal en el servidor. Intena de nuevo');
        }
        console.error('Detalle del error:',err);
      }
      });
    }
  }

  //validador de nombre de mueble repetido en la misma sucursal
  nombreRepetido(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const nombre = control.value;
      const sucursalId = this.form?.get('sucursal_id')?.value;

      if(!nombre || !sucursalId || this.id !==0) return of(null);

      return this._muebleService.verificarNombre(nombre, sucursalId).pipe(
        delay(400),
        map(res => (res.existe ? { nombreEnSucursalTomado: true} : null)),
        catchError(() => of(null))
      );
    };
  }
}
