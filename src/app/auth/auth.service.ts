// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from 'src/environments/environment.prod';






@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl: string = environment.apiUrl + '/api/auth/login';



  private userRole: string | null = null;

  constructor(private http: HttpClient, private router: Router) {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      this.userRole = storedRole;
    }
  }

  login(username: string, password: string) {
    return this.http.post<{ success: boolean; rol: string }>(
      this.apiUrl,
      { username, password },
      { withCredentials: true }           // 👈 habilita envío/recepción de cookies
    ).pipe(
      tap(response => {
        if (response.success) {
          this.userRole = response.rol;
          localStorage.setItem('userRole', response.rol);
        }
      })
    );
  }

  isAuthenticated(): boolean {
    return this.userRole !== null;
  }

  getRole(): string | null {
    return this.userRole;
  }

  logout() {
    this.userRole = null;
    localStorage.removeItem('userRole');
    this.router.navigate(['/login']);
  }
}

