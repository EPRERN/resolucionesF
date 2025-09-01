import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';



export interface TResolucionesyears{
  t_resolucionesyearid?: number; 
  t_resolucionesyearnumber: number; 
}


@Injectable({
  providedIn: 'root'
})
export class ResolucionesyearService {

private apiUrl = 'http://localhost:8080/api/t_resolucionesyears'; // Ajusta el puerto si tu backend usa otro

  constructor(private http: HttpClient) {}

  getAll(): Observable<TResolucionesyears[]>{
    return this.http.get<TResolucionesyears[]>(this.apiUrl);
  }


  getById(id:number): Observable<TResolucionesyears>{
    return this.http.get<TResolucionesyears>(`${this.apiUrl}/${id}`);
  }

  create(resolucionesyear:TResolucionesyears): Observable<TResolucionesyears>{
    return this.http.post<TResolucionesyears>(this.apiUrl, resolucionesyear);
  }

  update(id:number, resolucionesyear: TResolucionesyears):Observable<TResolucionesyears>{
    return this.http.put<TResolucionesyears>(`${this.apiUrl}/${id}`, resolucionesyear);
  }

  delete(id:number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
