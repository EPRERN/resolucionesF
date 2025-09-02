import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { T_resoluciones } from './resoluciones.model';

@Injectable({
  providedIn: 'root'
})
export class ResolucionesService {

 private apiUrl = 'http://localhost:8080/api/t_resolucioness';

  constructor(private http: HttpClient) {}

  getAll(): Observable<T_resoluciones[]> {
    return this.http.get<T_resoluciones[]>(this.apiUrl);
  }

  getById(id: number): Observable<T_resoluciones> {
    return this.http.get<T_resoluciones>(`${this.apiUrl}/${id}`);
  }

create(formData: FormData): Observable<T_resoluciones> {
  return this.http.post<T_resoluciones>(this.apiUrl, formData);
}


  update(id: number, resolucion: T_resoluciones): Observable<T_resoluciones> {
    return this.http.put<T_resoluciones>(`${this.apiUrl}/${id}`, resolucion);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
