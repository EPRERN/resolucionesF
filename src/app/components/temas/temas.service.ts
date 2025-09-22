import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { T_temas } from './temas.model';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TemasService {


  private apiUrl: string = environment.apiUrl + '/api/t_temass';


  constructor(private http: HttpClient) { }

  getAll(): Observable<T_temas[]> {
    return this.http.get<T_temas[]>(this.apiUrl);
  }

  getById(id: number): Observable<T_temas> {
    return this.http.get<T_temas>(`${this.apiUrl}/${id}`);
  }

  create(temas: T_temas): Observable<T_temas> {
    return this.http.post<T_temas>(this.apiUrl, temas);
  }

  update(id: number, temas: T_temas): Observable<T_temas> {
    return this.http.put<T_temas>(`${this.apiUrl}/${id}`, temas);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }



}
