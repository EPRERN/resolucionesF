import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';


export interface TtemasLotus {
  t_temaslotusid?: number;
  t_temaslotusdescripcion: string;
}



@Injectable({
  providedIn: 'root'
})
export class TemaslotusService {
  
  private apiUrl: string = environment.apiUrl + '/api/t_temaslotuss';

  constructor(private http: HttpClient) { }

  getAll(): Observable<TtemasLotus[]> {
    return this.http.get<TtemasLotus[]>(this.apiUrl);
  }

  getById(id: number): Observable<TtemasLotus> {
    return this.http.get<TtemasLotus>(`${this.apiUrl}/${id}`);
  }

  create(temasLotus: TtemasLotus): Observable<TtemasLotus> {
    return this.http.post<TtemasLotus>(this.apiUrl, temasLotus);
  }

  update(id: number, temasLotus: TtemasLotus): Observable<TtemasLotus> {
    return this.http.put<TtemasLotus>(`${this.apiUrl}/${id}`, temasLotus);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


}
