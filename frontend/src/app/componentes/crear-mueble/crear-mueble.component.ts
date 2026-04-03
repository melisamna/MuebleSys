import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { MuebleService } from '../../servicios/mueble.service';
import { Mueble } from '../../modelos/mueble';
import { CommonModule } from '@angular/common';
import { Categoria } from '../../modelos/categoria';
import { Sucursal } from '../../modelos/sucursal';
import { map,catchError, delay, of } from 'rxjs';


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

  constructor (
    private fb:FormBuilder,
    private _muebleService: MuebleService,
    private router: Router,
    private aRoute: ActivatedRoute
  ){ 
      this.form = this.fb.group({
      nombre_mueble: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['',Validators.required],
      precio: [null, [Validators.required, Validators.min(0)]],
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
    this.form.get('nombre_mueble')?.disable();
    this.form.get('descripcion')?.disable();
    this.form.get('categoria_id')?.disable();
    this.form.get('sucursal_id')?.disable();
    });
  }


  agregarMueble(){
    //si el formulario es invalido  se cota la ejecucion
    if(this.form.invalid) return;

    //extraemos todos loa valores incluyendo los bloqueados
    const formValues = this.form.getRawValue();

    // creamos el objeto basado en los valores del formulario
    const mueble: Mueble = {
      nombre_mueble: this.form.value.nombre_mueble,
      descripcion: this.form.value.descripcion,
      precio: this.form.value.precio,
      stockActual: this.form.value.stockActual,
      stockMinimo: this.form.value.stockMinimo,
      categoria_id: this.form.value.categoria_id,
      sucursal_id: this.form.value.sucursal_id,
      esActivo: true,
      imagen: this.form.value.imagen
    };

    if (this.id !==0){
      //Logica para EDITAR
      this._muebleService.updateMueble(this.id, mueble).subscribe({
        next: () => {
          alert('Mueble actualizado con éxito');
          this.router.navigate(['/inventario']);
        },
        error: (e) => console.error(e)
      });
    } else {
      //Lógica para crear
    this._muebleService.saveMueble(mueble).subscribe({
      next: (res) =>{
        alert(`El mueble ${mueble.nombre_mueble} fue registrado`);
        this.router.navigate(['/inventario']);
      },
      error: (err) => {
        //si el backend responde con un error 400 
        if(err.status === 400){
          //muestra el mensaje de que ya existe
          alert(err.error.msg);
        } else {
          alert('ups, algo salió mal en el servidor. Intenalo de nuevo');
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
