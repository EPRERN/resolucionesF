// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
     private apiUrl = 'http://localhost:8080/api/auth/login';
  private userRole: string | null = null;

  constructor(private http: HttpClient, private router: Router) {
    // Cargamos el rol desde localStorage al iniciar
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      this.userRole = storedRole;
    }
  }

  login(username: string, password: string) {
    return this.http.post<{ success: boolean, rol: string }>(this.apiUrl, { username, password })
      .pipe(tap(response => {
        if (response.success) {
          this.userRole = response.rol;
          localStorage.setItem('userRole', response.rol);
        }
      }));
  }

  // Ya no usamos isLoggedIn, solo verificamos si hay un rol
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
