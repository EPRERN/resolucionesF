import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {  T_resoluciones } from './resoluciones.model';
import { environment } from 'src/environments/environment.prod';
import { ResolucionDTO } from './carga-resoluciones/resolucionesDTO.model';

@Injectable({
    providedIn: 'root'
})
export class ResolucionesService {

    private apiUrl: string = environment.apiUrl + '/api/t_resolucioness';

    constructor(private http: HttpClient) { }

    // 👉 Devuelve DTO sin el blob
    getAll(): Observable<ResolucionDTO[]> {
        return this.http.get<ResolucionDTO[]>(this.apiUrl);
    }

    getById(id: number): Observable<T_resoluciones> {
        return this.http.get<T_resoluciones>(`${this.apiUrl}/${id}`);
    }

    create(formData: FormData): Observable<T_resoluciones> {
        return this.http.post<T_resoluciones>(this.apiUrl, formData);
    }

    getPdf(id: number): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/${id}/file`, { responseType: 'blob' });
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }


}
