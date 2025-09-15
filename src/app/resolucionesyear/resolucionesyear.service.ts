import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';



export interface TResolucionesyears{
  t_resolucionesyearid?: number; 
  t_resolucionesyearnumber: number; 
}


@Injectable({
  providedIn: 'root'
})
export class ResolucionesyearService {


  private apiUrl: string = environment.apiUrl + '/api/t_resolucionesyears';
  


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
