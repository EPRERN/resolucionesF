import { Component, OnInit } from '@angular/core';
import { T_resoluciones } from './resoluciones.model';
import { ResolucionesService } from './resoluciones.service';

@Component({
  selector: 'app-resoluciones',
  templateUrl: './resoluciones.component.html',
  styleUrls: ['./resoluciones.component.css']
})
export class ResolucionesComponent implements OnInit {

  resoluciones: T_resoluciones[] = [];
  nuevaResolucion: T_resoluciones = {
    t_resolucionesid: 0,
    t_resolucionesnro: '',
    distribuidora: { t_distribuidorasid: 1, t_distribuidorasnombre: '' },
    t_temasid: 1,
    t_resolucionesexpte: '',
    t_resolucionestitulo: '',
    t_resolucionesexptecaratula: '',
    t_resolucionesdate: new Date()
  };
  selectedFile: File | null = null;

  constructor(private resolucionesService: ResolucionesService) { }

  ngOnInit(): void {
    this.cargarResoluciones();
  }


  // Paginación
  page: number = 1;
  pageSize: number = 20;

  get resolucionesPaginadas(): T_resoluciones[] {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.resoluciones.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.resoluciones.length / this.pageSize);
  }





  cargarResoluciones(): void {
    this.resolucionesService.getAll().subscribe(data => {
      this.resoluciones = data;
      console.log('DATOS: ', data);

    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }


  private generarTitulo(): void {
    this.nuevaResolucion.t_resolucionestitulo =
      `Res. ${this.nuevaResolucion.t_resolucionesnro} ${this.nuevaResolucion.t_resolucionesexpte} ${this.nuevaResolucion.t_resolucionesexptecaratula}`;
  }



  agregarResolucion(): void {
    // Antes de enviar, generamos el título automáticamente
    this.generarTitulo();

    const formData = new FormData();
    const resolucionBlob = new Blob([JSON.stringify(this.nuevaResolucion)], { type: 'application/json' });
    formData.append('resolucion', resolucionBlob);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.resolucionesService.create(formData).subscribe(() => {
      this.cargarResoluciones();
      this.nuevaResolucion = {
        t_resolucionesid: 0,
        t_resolucionesnro: '',
        distribuidora: { t_distribuidorasid: 1, t_distribuidorasnombre: '' },
        t_temasid: 1,
        t_resolucionesexpte: '',
        t_resolucionestitulo: '',
        t_resolucionesexptecaratula: '',
        t_resolucionesdate: new Date()
      };
      this.selectedFile = null;
    });
  }


  eliminarResolucion(id?: number): void {
    if (id == null) {
      console.error('ID inválido, no se puede eliminar.');
      return;
    }
    this.resolucionesService.delete(id).subscribe(() => {
      this.cargarResoluciones();
    });
  }

  descargarPDF(id: number): void {
    const url = `http://localhost:8080/api/t_resolucioness/${id}/file`;
    window.open(url, '_blank');
  }
}
