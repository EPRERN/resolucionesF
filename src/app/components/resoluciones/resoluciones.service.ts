import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment.prod';

import {
    T_resoluciones,
    GuardarResolucionResponse,
    EliminarResolucionResponse
} from './resoluciones.model';

import { ResolucionDTO } from './carga-resoluciones/resolucionesDTO.model';

@Injectable({
    providedIn: 'root'
})
export class ResolucionesService {
    
    private apiUrl: string = environment.apiUrl + '/api/t_resolucioness/index.php';
    
    constructor(private http: HttpClient) { }
    
    getAll(): Observable<ResolucionDTO[]> {
        return this.http.get<ResolucionDTO[]>(this.apiUrl);
    }
    
    getById(id: number): Observable<T_resoluciones> {
        return this.http.get<T_resoluciones>(`${this.apiUrl}?id=${id}`);
    }
    
    create(formData: FormData): Observable<GuardarResolucionResponse> {
        return this.http.post<GuardarResolucionResponse>(this.apiUrl, formData);
    }
    
    delete(id: number): Observable<EliminarResolucionResponse> {
        return this.http.post<EliminarResolucionResponse>(
            `${this.apiUrl}?action=delete&id=${id}`,
            null
        );
    }
    
    getPdf(id: number): Observable<Blob> {
        return this.http.get(`${environment.apiUrl}/api/t_resolucioness/file.php?id=${id}`, {
            responseType: 'blob'
        });
    }
}