import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { T_temas } from './temas.model';

@Injectable({
  providedIn: 'root'
})
export class TemasService {

  private apiUrl = 'http://localhost:8080/api/t_temass';

  constructor(private http: HttpClient) {}

  getAll(): Observable<T_temas[]> {
    return this.http.get<T_temas[]>(this.apiUrl);
  }

}
