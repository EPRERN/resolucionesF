import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { ResolucionesService } from '../resoluciones.service';
import { ResolucionDTO } from './resolucionesDTO.model';

@Component({
    selector: 'app-carga-resoluciones',
    templateUrl: './carga-resoluciones.component.html',
    styleUrls: ['./carga-resoluciones.component.css']
})
export class CargaResolucionesComponent implements OnInit {
    
    resoluciones: ResolucionDTO[] = [];
    resolucionesFiltradas: ResolucionDTO[] = [];
    
    loading: boolean = false;
    
    page: number = 1;
    pageSize: number = 10;
    
    filtroNro: string = '';
    filtroExpte: string = '';
    filtroFecha: string = '';
    
    pdfPreviewUrl: string | null = null;
    
    constructor(private resolucionesService: ResolucionesService) { }
    
    ngOnInit(): void {
        this.cargarResoluciones();
    }
    
    cargarResoluciones(): void {
        this.loading = true;
        
        this.resolucionesService.getAll().subscribe({
            next: (data) => {
                /*
                Ordeno por ID descendente para que lo recién cargado aparezca primero.
                Si preferís ordenar por fecha de resolución, sacá este sort.
                */
                this.resoluciones = [...data].sort((a, b) => {
                    return (b.t_resolucionesid ?? 0) - (a.t_resolucionesid ?? 0);
                });
                
                this.resolucionesFiltradas = [...this.resoluciones];
                this.page = 1;
                this.loading = false;
                
                console.log('Resoluciones recibidas del backend:', this.resoluciones);
            },
            error: (err) => {
                console.error('Error al cargar resoluciones:', err);
                this.loading = false;
                
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudieron cargar las resoluciones desde el backend.',
                    confirmButtonText: 'Aceptar'
                });
            }
        });
    }
    
    get resolucionesPaginadas(): ResolucionDTO[] {
        const startIndex = (this.page - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        
        return this.resolucionesFiltradas.slice(startIndex, endIndex);
    }
    
    get totalPages(): number {
        return Math.ceil(this.resolucionesFiltradas.length / this.pageSize) || 1;
    }
    
    irAPagina(): void {
        if (this.page < 1) {
            this.page = 1;
        }
        
        if (this.page > this.totalPages) {
            this.page = this.totalPages;
        }
    }
    
    aplicarFiltro(): void {
        this.resolucionesFiltradas = this.resoluciones.filter((r) => {
            const nro = r.t_resolucionesnro ?? '';
            const expte = r.t_resolucionesexpte ?? '';
            const fecha = this.normalizarFecha(r.t_resolucionesdate);
            
            const coincideNro = this.filtroNro
            ? nro.toLowerCase().includes(this.filtroNro.toLowerCase())
            : true;
            
            const coincideExpte = this.filtroExpte
            ? expte.toLowerCase().includes(this.filtroExpte.toLowerCase())
            : true;
            
            const coincideFecha = this.filtroFecha
            ? fecha === this.filtroFecha
            : true;
            
            return coincideNro && coincideExpte && coincideFecha;
        });
        
        this.page = 1;
    }
    
    private normalizarFecha(fecha: string | Date): string {
        if (!fecha) {
            return '';
        }
        
        if (typeof fecha === 'string') {
            /*
            MySQL suele devolver:
            2025-09-04 00:00:00
            o
            2025-09-04T00:00:00
            */
            const match = fecha.match(/^(\d{4}-\d{2}-\d{2})/);
            
            if (match) {
                return match[1];
            }
        }
        
        const d = fecha instanceof Date ? fecha : new Date(fecha);
        
        if (isNaN(d.getTime())) {
            return '';
        }
        
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    }
    
    eliminarResolucion(id?: number): void {
        if (!id) {
            Swal.fire('Error', 'ID inválido. No se puede eliminar la resolución.', 'error');
            return;
        }
        
        Swal.fire({
            title: '¿Eliminar resolución?',
            text: 'Esta acción eliminará la resolución y su PDF asociado de la base de datos.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (!result.isConfirmed) {
                return;
            }
            
            this.resolucionesService.delete(id).subscribe({
                next: (resp) => {
                    console.log('Respuesta DELETE:', resp);
                    
                    if (!resp || resp.success !== true) {
                        Swal.fire('Error', 'El backend respondió, pero no confirmó la eliminación.', 'error');
                        return;
                    }
                    
                    this.resoluciones = this.resoluciones.filter(r => r.t_resolucionesid !== id);
                    this.resolucionesFiltradas = this.resolucionesFiltradas.filter(r => r.t_resolucionesid !== id);
                    
                    this.irAPagina();
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Eliminado',
                        text: 'La resolución fue eliminada correctamente.',
                        confirmButtonText: 'Aceptar'
                    });
                },
                error: (err) => {
                    console.error('Error eliminando resolución:', err);
                    
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        html: `<pre style="text-align:left;white-space:pre-wrap">${JSON.stringify(err.error, null, 2)}</pre>`,
                        confirmButtonText: 'Aceptar'
                    });
                }
            });
        });
    }
    
    descargarPDF(id?: number): void {
        if (!id) {
            Swal.fire('Error', 'ID inválido. No se puede descargar el PDF.', 'error');
            return;
        }
        
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
    
    abrirPreview(id?: number): void {
        if (!id) {
            Swal.fire('Error', 'ID inválido. No se puede abrir la vista previa.', 'error');
            return;
        }
        
        this.resolucionesService.getPdf(id).subscribe({
            next: (blob) => {
                if (this.pdfPreviewUrl) {
                    URL.revokeObjectURL(this.pdfPreviewUrl);
                }
                
                this.pdfPreviewUrl = URL.createObjectURL(blob);
            },
            error: (err) => {
                console.error('Error abriendo vista previa:', err);
                Swal.fire('Error', 'No se pudo abrir la vista previa del PDF.', 'error');
            }
        });
    }
    
    cerrarPreview(): void {
        if (this.pdfPreviewUrl) {
            URL.revokeObjectURL(this.pdfPreviewUrl);
        }
        
        this.pdfPreviewUrl = null;
    }
}