import { Component } from '@angular/core';
import { T_resoluciones } from '../resoluciones.model';
import { ResolucionesService } from '../resoluciones.service';
import { T_temas } from 'src/app/temas/temas.model';
import { TemasService } from 'src/app/temas/temas.service';

@Component({
  selector: 'app-carga-resoluciones',
  templateUrl: './carga-resoluciones.component.html',
  styleUrls: ['./carga-resoluciones.component.css']
})
export class CargaResolucionesComponent {


  resoluciones: T_resoluciones[] = [];
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

  resolucionesFiltradas: T_resoluciones[] = [];
  cargarResoluciones(): void {
    this.resolucionesService.getAll().subscribe(data => {
      this.resoluciones = data;
      this.resolucionesFiltradas = data; // inicial
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
}
