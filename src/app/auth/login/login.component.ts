import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
      username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.username, this.password).subscribe({
      next: (success) => {
        if (success) {
          this.authService.setLoggedIn(true);
          this.router.navigate(['/dashboard']);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Usuario o contraseña incorrectos'
          });
        }
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error en el servidor',
          text: 'No se pudo conectar al backend'
        });
      }
    });
  }
}
