// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;
  private apiUrl = 'http://localhost:8080/api/auth/login';
  private userRole: string | null = null;


  constructor(private http: HttpClient, private router: Router) { }
  login(username: string, password: string) {
    return this.http.post<{ success: boolean, rol: string }>(this.apiUrl, { username, password });
  }

  setLoggedIn(value: boolean, role: string | null) {
    this.isLoggedIn = value;
    this.userRole = role;
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  getRole(): string | null {
    return this.userRole;
  }

  logout() {
    this.isLoggedIn = false;
    this.userRole = null;
    this.router.navigate(['/login']);
  }
}
