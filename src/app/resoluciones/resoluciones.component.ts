import { Component, OnInit } from '@angular/core';
import { T_resoluciones } from './resoluciones.model';
import { ResolucionesService } from './resoluciones.service';
import { T_temas } from '../temas/temas.model';
import { TemasService } from '../temas/temas.service';

@Component({
    selector: 'app-resoluciones',
    templateUrl: './resoluciones.component.html',
    styleUrls: ['./resoluciones.component.css']
})
export class ResolucionesComponent implements OnInit {


    temas: T_temas[] = [];

    filtroNro: string = '';
    filtroExpte: string = '';
    resolucionesFiltradas: T_resoluciones[] = [];

    resoluciones: T_resoluciones[] = [];
    nuevaResolucion: T_resoluciones = {

        t_resolucionesnro: '',
        distribuidora: { t_distribuidorasid: 1, t_distribuidorasnombre: '' },
        tema: { t_temasid: 1 },
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









    // Paginación
    page: number = 1;
    pageSize: number = 10;

    get resolucionesPaginadas(): T_resoluciones[] {
        const data = this.resolucionesFiltradas.length ? this.resolucionesFiltradas : this.resoluciones;
        const startIndex = (this.page - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        return data.slice(startIndex, endIndex);
    }

    get totalPages(): number {
        const data = this.resolucionesFiltradas.length ? this.resolucionesFiltradas : this.resoluciones;
        return Math.ceil(data.length / this.pageSize);
    }





    cargarResoluciones(): void {
        this.resolucionesService.getAll().subscribe(data => {
            this.resoluciones = data;
            this.resolucionesFiltradas = data; // inicial
        });
    }


    onFileSelected(event: any): void {
        const file: File = event.target.files[0];
        if (!file) return;

        this.selectedFile = file; // guardamos el archivo para subir después

        const reader = new FileReader();
        reader.onload = () => {
            const contenido = reader.result as string;
            const resolucion = this.parseLotusFile(contenido);

            // asignar valores a nuevaResolucion
            this.nuevaResolucion.t_resolucionesnro = resolucion.NroResolucion || '';
            this.nuevaResolucion.t_resolucionesexpte = resolucion.NROEXP || '';
            this.nuevaResolucion.t_resolucionesexptecaratula = resolucion.ExtrExp || '';
            this.nuevaResolucion.t_resolucionestitulo = resolucion.Titulo || '';

            // Fecha
            if (resolucion.FechaReg) {
                // suponiendo formato "dd/MM/yyyy HH:mm:ss"
                const partes = resolucion.FechaReg.split(" ")[0].split("/");
                const fecha = new Date(
                    parseInt(partes[2]),       // año
                    parseInt(partes[1]) - 1,   // mes
                    parseInt(partes[0])        // día
                );
                this.nuevaResolucion.t_resolucionesdate = fecha;
            }

            // Distribuidora
            if (resolucion.Distribuidora) {
                const distribuidoraMap: { [key: string]: number } = {
                    "EDERSA": 1,
                    "CEB": 2,
                    "CEARC": 3,
                    "OTROS": 4,
                    "EPRE": 5,
                    "TODAS": 6
                };
                const id = distribuidoraMap[resolucion.Distribuidora.trim().toUpperCase()];
                if (id) {
                    this.nuevaResolucion.distribuidora = {
                        t_distribuidorasid: id,
                        t_distribuidorasnombre: resolucion.Distribuidora
                    };
                }
            }

            console.log("Archivo parseado:", resolucion);
            console.log("Nueva resolución generada:", this.nuevaResolucion);
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



    agregarResolucion(): void {
        // Antes de enviar, generamos el título automáticamente
        this.generarTitulo();

        // Clonar objeto para no modificar el binding
        const resolucionParaEnviar = { ...this.nuevaResolucion };

        // ⚠️ Aquí dejamos la fecha como Date, NO la convertimos a string
        resolucionParaEnviar.t_resolucionesdate = this.nuevaResolucion.t_resolucionesdate;

        const formData = new FormData();
        const resolucionBlob = new Blob(
            [JSON.stringify(resolucionParaEnviar)],
            { type: 'application/json' }
        );
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
                tema: { t_temasid: 1 },
                t_resolucionesexpte: '',
                t_resolucionestitulo: '',
                t_resolucionesexptecaratula: '',
                t_resolucionesdate: new Date()
            };
            this.selectedFile = null;
        });
    }


    // Función auxiliar para formatear la fecha
    formatDateToBackend(date: Date): string {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day} 00:00:00`;
    }






    irAPagina(): void {
        if (this.page < 1) {
            this.page = 1;
        } else if (this.page > this.totalPages) {
            this.page = this.totalPages;
        }
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
        const url = `http://localhost:8080/api/t_resolucioness/${id}/download`;
        window.open(url, '_blank');
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
