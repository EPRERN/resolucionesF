import { Component, OnInit } from '@angular/core';

import Swal from 'sweetalert2';

import { ResolucionesService } from './resoluciones.service';
import { T_temas } from '../temas/temas.model';
import { TemasService } from '../temas/temas.service';
import { ResolucionDTO } from './carga-resoluciones/resolucionesDTO.model';

interface ResolucionCargaPayload {
    t_resolucionesid?: number;
    
    t_resolucionesnro: string;
    
    distribuidora: {
        t_distribuidorasid: number;
        t_distribuidorasnombre: string;
    };
    
    tema: {
        t_temasid: number;
        t_temasdescripcion: string;
        temasLotus: {
            t_temaslotusid: number;
        };
    };
    
    t_resolucionesexpte: string;
    t_resolucionestitulo: string;
    t_resolucionesexptecaratula: string;
    t_resolucionesdate: Date | string;
}

@Component({
    selector: 'app-resoluciones',
    templateUrl: './resoluciones.component.html',
    styleUrls: ['./resoluciones.component.css']
})
export class ResolucionesComponent implements OnInit {
    
    lotusFile: File | null = null;
    pdfFile: File | null = null;
    
    temas: T_temas[] = [];
    
    filtroNro: string = '';
    filtroExpte: string = '';
    
    resoluciones: ResolucionDTO[] = [];
    resolucionesFiltradas: ResolucionDTO[] = [];
    
    page: number = 1;
    pageSize: number = 10;
    
    pdfPreviewUrl: string | null = null;
    
    nuevaResolucion: ResolucionCargaPayload = this.nuevaResolucionVacia();
    
    constructor(
        private resolucionesService: ResolucionesService,
        private temasService: TemasService
    ) { }
    
    ngOnInit(): void {
        this.temasService.getAll().subscribe({
            next: (data) => {
                this.temas = data;
            },
            error: (err) => {
                console.error('Error cargando temas:', err);
                Swal.fire('Error', 'No se pudieron cargar los temas.', 'error');
            }
        });
    }
    
    private nuevaResolucionVacia(): ResolucionCargaPayload {
        return {
            t_resolucionesid: 0,
            t_resolucionesnro: '',
            distribuidora: {
                t_distribuidorasid: 1,
                t_distribuidorasnombre: ''
            },
            tema: {
                t_temasid: 1,
                t_temasdescripcion: '',
                temasLotus: {
                    t_temaslotusid: 0
                }
            },
            t_resolucionesexpte: '',
            t_resolucionestitulo: '',
            t_resolucionesexptecaratula: '',
            t_resolucionesdate: new Date()
        };
    }
    
    onLotusFileSelected(event: any): void {
        const file: File | undefined = event.target.files?.[0];
        
        if (!file) {
            return;
        }
        
        this.lotusFile = file;
        
        const reader = new FileReader();
        
        reader.onload = () => {
            const arrayBuffer = reader.result as ArrayBuffer;
            const decoder = new TextDecoder('iso-8859-1');
            const contenido = decoder.decode(arrayBuffer);
            
            const resolucion = this.parseLotusFile(contenido);
            
            this.nuevaResolucion.t_resolucionesnro = resolucion.NroResolucion || '';
            this.nuevaResolucion.t_resolucionesexpte = resolucion.NROEXP || '';
            this.nuevaResolucion.t_resolucionesexptecaratula = resolucion.ExtrExp || '';
            this.nuevaResolucion.t_resolucionestitulo = resolucion.Titulo || '';
            
            const fecha = this.parseFechaLotusToDate(resolucion.FechaNI || resolucion.FechaReg);
            
            if (fecha) {
                this.nuevaResolucion.t_resolucionesdate = fecha;
            }
            
            if (resolucion.Distribuidora) {
                const distribuidoraMap: { [key: string]: number } = {
                    EDERSA: 1,
                    CEB: 2,
                    CEARC: 3,
                    OTROS: 4,
                    EPRE: 5,
                    TODAS: 6
                };
                
                const clave = resolucion.Distribuidora.trim().toUpperCase();
                const id = distribuidoraMap[clave];
                
                if (id) {
                    this.nuevaResolucion.distribuidora = {
                        t_distribuidorasid: id,
                        t_distribuidorasnombre: resolucion.Distribuidora
                    };
                }
            }
            
            console.log('Lotus parseado:', resolucion);
            console.log('Nueva resolución:', this.nuevaResolucion);
        };
        
        reader.onerror = () => {
            Swal.fire('Error', 'No se pudo leer el archivo Lotus.', 'error');
        };
        
        reader.readAsArrayBuffer(file);
    }
    
    onPdfFileSelected(event: any): void {
        const file: File | undefined = event.target.files?.[0];
        
        if (!file) {
            this.pdfFile = null;
            return;
        }
        
        const esPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
        
        if (!esPdf) {
            this.pdfFile = null;
            Swal.fire('Error', 'Debe seleccionar un archivo PDF válido.', 'error');
            return;
        }
        
        this.pdfFile = file;
        console.log('PDF seleccionado:', file.name, file.size);
    }
    
    agregarResolucion(): void {
        this.generarTitulo();
        
        if (!this.nuevaResolucion.t_resolucionesnro.trim()) {
            Swal.fire('Error', 'Falta el número de resolución.', 'error');
            return;
        }
        
        if (!this.nuevaResolucion.t_resolucionesexpte.trim()) {
            Swal.fire('Error', 'Falta el expediente.', 'error');
            return;
        }
        
        if (!this.nuevaResolucion.t_resolucionesexptecaratula.trim()) {
            Swal.fire('Error', 'Falta la carátula.', 'error');
            return;
        }
        
        if (!this.pdfFile) {
            Swal.fire('Error', 'Debe seleccionar el archivo PDF.', 'error');
            return;
        }
        
        const resolucionParaEnviar = {
            t_resolucionesnro: this.nuevaResolucion.t_resolucionesnro.trim(),
            distribuidora: {
                t_distribuidorasid: Number(this.nuevaResolucion.distribuidora.t_distribuidorasid)
            },
            tema: {
                t_temasid: Number(this.nuevaResolucion.tema.t_temasid)
            },
            t_resolucionesexpte: this.nuevaResolucion.t_resolucionesexpte.trim(),
            t_resolucionestitulo: this.nuevaResolucion.t_resolucionestitulo.trim(),
            t_resolucionesexptecaratula: this.nuevaResolucion.t_resolucionesexptecaratula.trim(),
            t_resolucionesdate: this.formatDateToBackend(this.nuevaResolucion.t_resolucionesdate)
        };
        
        const formData = new FormData();
        
        /*
        IMPORTANTE:
        Esto debe ir como string, no como Blob.
        Si lo mandás como Blob, PHP no lo recibe en $_POST['resolucion'].
        */
        formData.append('resolucion', JSON.stringify(resolucionParaEnviar));
        formData.append('file', this.pdfFile, this.pdfFile.name);
        
        console.log('JSON resolucionParaEnviar:', JSON.stringify(resolucionParaEnviar));
        console.log('--- FORM DATA A ENVIAR ---');
        
        formData.forEach((value, key) => {
            if (value instanceof File) {
                console.log(key, `FILE: ${value.name} (${value.size} bytes)`);
            } else {
                console.log(key, value);
            }
        });
        
        this.resolucionesService.create(formData).subscribe({
            next: (resp) => {
                console.log('Respuesta backend:', resp);
                
                if (!resp || resp.success !== true) {
                    Swal.fire('Error', 'El backend respondió, pero no confirmó el guardado.', 'error');
                    return;
                }
                
                Swal.fire({
                    icon: 'success',
                    title: 'Guardado',
                    text: `La resolución se ha guardado correctamente. ID: ${resp.id}`,
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    this.nuevaResolucion = this.nuevaResolucionVacia();
                    this.lotusFile = null;
                    this.pdfFile = null;
                });
            },
            
            error: (err) => {
                console.error('Error backend:', err);
                console.error('Respuesta error:', err.error);
                
                const msg =
                typeof err?.error === 'string'
                ? err.error
                : JSON.stringify(err?.error || {});
                
                const esDuplicado =
                msg.includes('llave duplicada') ||
                msg.includes('duplicate key') ||
                msg.includes('Duplicate entry') ||
                msg.includes('ut_resoluciones') ||
                msg.includes('t_resolucionesnro');
                
                if (esDuplicado) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Resolución duplicada',
                        text: `La resolución ${this.nuevaResolucion.t_resolucionesnro} ya se ha cargado.`,
                        confirmButtonText: 'Aceptar'
                    });
                    return;
                }
                
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    html: `<pre style="text-align:left;white-space:pre-wrap">${msg}</pre>`,
                    confirmButtonText: 'Aceptar'
                });
            }
        });
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
    
    formatDateToBackend(date: Date | string): string {
        if (!date) {
            return '';
        }
        
        const d = date instanceof Date ? date : new Date(date);
        
        if (isNaN(d.getTime())) {
            return '';
        }
        
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day} 00:00:00`;
    }
    
    private parseFechaLotusToDate(fechaStr?: string): Date | null {
        if (!fechaStr) {
            return null;
        }
        
        const soloFecha = fechaStr.split(' ')[0].trim();
        const partes = soloFecha.split('/');
        
        if (partes.length !== 3) {
            return null;
        }
        
        const dd = Number(partes[0]);
        const mm = Number(partes[1]);
        const yyyy = Number(partes[2]);
        
        if (!dd || !mm || !yyyy) {
            return null;
        }
        
        return new Date(yyyy, mm - 1, dd);
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
        
        this.page = 1;
    }
    
    get resolucionesPaginadas(): ResolucionDTO[] {
        const data = this.resolucionesFiltradas;
        const startIndex = (this.page - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        
        return data.slice(startIndex, endIndex);
    }
    
    get totalPages(): number {
        const data = this.resolucionesFiltradas;
        return Math.ceil(data.length / this.pageSize) || 1;
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
        
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'No podrás revertir esta acción',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.resolucionesService.delete(id).subscribe({
                    next: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Eliminado',
                            text: 'La resolución ha sido eliminada',
                            confirmButtonText: 'Aceptar'
                        });
                    },
                    error: (err) => {
                        console.error('Error eliminando resolución:', err);
                        Swal.fire('Error', 'No se pudo eliminar la resolución.', 'error');
                    }
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
                console.error('Error descargando PDF:', err);
                Swal.fire('Error', 'No se pudo descargar el PDF.', 'error');
            }
        });
    }
    
    abrirPreview(idOrFile: number | File): void {
        if (idOrFile instanceof File) {
            const reader = new FileReader();
            
            reader.onload = () => {
                this.pdfPreviewUrl = reader.result as string;
            };
            
            reader.readAsDataURL(idOrFile);
        } else {
            this.resolucionesService.getPdf(idOrFile).subscribe({
                next: (blob) => {
                    const url = URL.createObjectURL(blob);
                    this.pdfPreviewUrl = url;
                },
                error: (err) => {
                    console.error('Error abriendo vista previa:', err);
                    Swal.fire('Error', 'No se pudo abrir la vista previa.', 'error');
                }
            });
        }
    }
    
    cerrarPreview(): void {
        if (this.pdfPreviewUrl) {
            URL.revokeObjectURL(this.pdfPreviewUrl);
        }
        
        this.pdfPreviewUrl = null;
    }
}