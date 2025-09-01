import { Component } from '@angular/core';
import { ResolucionesyearService, TResolucionesyears } from './resolucionesyear.service';

@Component({
  selector: 'app-resolucionesyear',
  templateUrl: './resolucionesyear.component.html',
  styleUrls: ['./resolucionesyear.component.css']
})
export class ResolucionesyearComponent {
  resoluciones: TResolucionesyears[] = [];
  nuevaResolucion: TResolucionesyears = { t_resolucionesyearnumber: 0 };
  editando: TResolucionesyears | null = null;

  constructor(private resolucionesService: ResolucionesyearService) { }

  ngOnInit(): void {
    this.cargarResoluciones();
  }

  cargarResoluciones(): void {
    this.resolucionesService.getAll().subscribe(data => {
      console.log('Datos recibidos del back : ', data);
      this.resoluciones = data
    })
  }


  agregarResolucion(): void {
    if (!this.nuevaResolucion.t_resolucionesyearnumber) return;
    this.resolucionesService.create(this.nuevaResolucion).subscribe(() => {
      this.cargarResoluciones();
      this.nuevaResolucion = { t_resolucionesyearnumber: 0 };
    });
  }

  editarResolucion(dis: TResolucionesyears): void {
    this.editando = { ...dis };
  }

  guardarEdicion(): void {
    if (this.editando && this.editando.t_resolucionesyearid) {
      this.resolucionesService.update(this.editando.t_resolucionesyearid, this.editando).subscribe(() => {
        this.cargarResoluciones();
        this.editando = null;
      })
    }
  }

  cancelarEdicion(): void {
    this.editando = null;
  }

  eliminarResolucion(id: number): void {
    this.resolucionesService.delete(id).subscribe({
      next: () => {
        this.cargarResoluciones();
        console.log('Se borro');
      },
      error: (err) => {
        if (err.status === 409) {
          alert('No se puede eliminar la resolucion');
        } else {
          alert('Error al eliminar la distribuidora');
        }
      }
    })
  }


}
