import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface TtemasLotus {
  t_temaslotusid?: number;
  t_temaslotusdescripcion: string;
}



@Injectable({
  providedIn: 'root'
})
export class TemaslotusService {

  private apiUrl = 'http://localhost:8080/api/t_temaslotuss'; // Ajusta el puerto si tu backend usa otro

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
