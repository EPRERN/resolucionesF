import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';


export interface TDistribuidoras {
  t_distribuidorasid?: number;
  t_distribuidorasnombre: string;
}


@Injectable({
  providedIn: 'root'
})
export class DistribuidorasService {


  private apiUrl: string = environment.apiUrl + '/api/t_distribuidorass';



  constructor(private http: HttpClient) { }

  getAll(): Observable<TDistribuidoras[]> {
    return this.http.get<TDistribuidoras[]>(this.apiUrl, {
      withCredentials: true,
      headers: {
        Authorization: 'Basic ' + btoa('usuarioReal:passwordReal')
      }
    });
  }


  getById(id: number): Observable<TDistribuidoras> {
    return this.http.get<TDistribuidoras>(`${this.apiUrl}/${id}`);
  }

  create(distribuidora: TDistribuidoras): Observable<TDistribuidoras> {
    return this.http.post<TDistribuidoras>(this.apiUrl, distribuidora);
  }

  update(id: number, distribuidora: TDistribuidoras): Observable<TDistribuidoras> {
    return this.http.put<TDistribuidoras>(`${this.apiUrl}/${id}`, distribuidora);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
