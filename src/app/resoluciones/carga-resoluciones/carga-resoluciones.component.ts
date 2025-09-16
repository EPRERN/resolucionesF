import { Component } from '@angular/core';
import { T_resoluciones } from '../resoluciones.model';
import { ResolucionesService } from '../resoluciones.service';
import { T_temas } from 'src/app/temas/temas.model';
import { TemasService } from 'src/app/temas/temas.service';
import Swal from 'sweetalert2';
import { ResolucionDTO } from './resolucionesDTO.model';

@Component({
  selector: 'app-carga-resoluciones',
  templateUrl: './carga-resoluciones.component.html',
  styleUrls: ['./carga-resoluciones.component.css']
})
export class CargaResolucionesComponent {



  temas: T_temas[] = [];

  nuevaResolucion: T_resoluciones = {
    t_resolucionesnro: '',
    distribuidora: { t_distribuidorasid: 1, t_distribuidorasnombre: '' },
    tema: { t_temasid: 1, t_temasdescripcion: '', t_temaslotusid: 0 },
    t_resolucionesexpte: '',
    t_resolucionestitulo: '',
    t_resolucionesexptecaratula: '',
    t_resolucionesdate: new Date()
  };
  selectedFile: File | null = null;

  constructor(private resolucionesService: ResolucionesService, private temasService: TemasService) { }


  ngOnInit(): void {
    this.cargarResoluciones();
    this.temasService.getAll().subscribe(data => {
      this.temas = data;
    });
  }



  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const contenido = reader.result as string;
      const resolucion = this.parseLotusFile(contenido);

      // ahora lo asignás a tu modelo
      this.nuevaResolucion.t_resolucionesnro = resolucion.NroResolucion || '';
      this.nuevaResolucion.t_resolucionesexpte = resolucion.NROEXP || '';
      this.nuevaResolucion.t_resolucionesexptecaratula = resolucion.ExtrExp || '';
      this.nuevaResolucion.t_resolucionestitulo = resolucion.Titulo || '';
      this.nuevaResolucion.t_resolucionesdate = resolucion.FechaReg
        ? new Date(resolucion.FechaReg)
        : new Date();

      console.log("Archivo parseado:", resolucion);
    };
    reader.readAsText(file);
  }

  private parseLotusFile(contenido: string): any {
    const resultado: any = {};
    const lineas = contenido.split(/\r?\n/);

    for (const linea of lineas) {
      const [clave, ...valorParts] = linea.split(':');
      if (clave && valorParts.length > 0) {
        resultado[clave.trim()] = valorParts.join(':').trim();
      }
    }

    return resultado;
  }
  private generarTitulo(): void {
    this.nuevaResolucion.t_resolucionestitulo =
      `Res. ${this.nuevaResolucion.t_resolucionesnro} ${this.nuevaResolucion.t_resolucionesexpte} ${this.nuevaResolucion.t_resolucionesexptecaratula}`;
  }


  resoluciones: ResolucionDTO[] = [];
  resolucionesFiltradas: ResolucionDTO[] = [];


  loading: boolean = false;  // 👈 Nueva bandera de carga


  cargarResoluciones(): void {
    this.loading = true; // mostrar loader
    this.resolucionesService.getAll().subscribe({
      next: (data) => {
        this.resoluciones = data;
        this.resolucionesFiltradas = data;
        this.loading = false; // ocultar loader cuando termina
      },
      error: (err) => {
        console.error("Error al cargar resoluciones:", err);
        this.loading = false; // ocultar loader aunque falle
      }
    });
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
        tema: { t_temasid: 1, t_temasdescripcion: '', t_temaslotusid: 0 },
        t_resolucionesexpte: '',
        t_resolucionestitulo: '',
        t_resolucionesexptecaratula: '',
        t_resolucionesdate: new Date()
      };
      this.selectedFile = null;
    });
  }

  page: number = 1;
  pageSize: number = 10;

  get resolucionesPaginadas(): ResolucionDTO[] {
    const data = this.resolucionesFiltradas;
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return data.slice(startIndex, endIndex);
  }


  get totalPages(): number {
    const data = this.resolucionesFiltradas;
    return Math.ceil(data.length / this.pageSize) || 1; // devolvemos al menos 1 para que no rompa el input de página
  }

  irAPagina(): void {
    if (this.page < 1) {
      this.page = 1;
    } else if (this.page > this.totalPages) {
      this.page = this.totalPages;
    }
  }
  filtroNro: string = '';
  filtroExpte: string = '';


  aplicarFiltro(): void {
    this.resolucionesFiltradas = this.resoluciones.filter(r => {
      const coincideNro = this.filtroNro
        ? r.t_resolucionesnro.toLowerCase().includes(this.filtroNro.toLowerCase())
        : true;
      const coincideExpte = this.filtroExpte
        ? r.t_resolucionesexpte.toLowerCase().includes(this.filtroExpte.toLowerCase())
        : true;
      return coincideNro && coincideExpte;
    });
    this.page = 1; // resetear paginación al filtrar
  }

  eliminarResolucion(id?: number): void {
    if (id == null) {
      console.error('ID inválido, no se puede eliminar.');
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.resolucionesService.delete(id).subscribe(() => {
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'La resolución ha sido eliminada',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            window.location.reload(); // 🔄 recarga la página al confirmar
          });
        });
      }
    });
  }
  descargarPDF(id: number): void {
    this.resolucionesService.getPdf(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resolucion_${id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error("Error descargando PDF:", err);
        Swal.fire("Error", "No se pudo descargar el PDF", "error");
      }
    });
  }

  pdfPreviewUrl: string | null = null;

  abrirPreview(idOrFile: number | File): void {
    if (idOrFile instanceof File) {
      // Caso archivo local
      const reader = new FileReader();
      reader.onload = () => this.pdfPreviewUrl = reader.result as string;
      reader.readAsDataURL(idOrFile);
    } else {
      // Caso archivo desde backend
      this.resolucionesService.getPdf(idOrFile).subscribe(blob => {
        const url = URL.createObjectURL(blob); // Creamos un URL temporal
        this.pdfPreviewUrl = url;
      });
    }
  }


  cerrarPreview(): void {
    this.pdfPreviewUrl = null;
  }

}
