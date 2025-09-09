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

  constructor(private authService: AuthService, private router: Router) { }

  onLogin() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        if (response.success) {
          this.authService.setLoggedIn(true, response.rol);

          if (response.rol === 'ADMINISTRADOR') {
            this.router.navigate(['/dashboard']);
            console.log('administrador ')
          } else if (response.rol === 'CARGADOR_RESOLUCIONES') {
            this.router.navigate(['/dashboard-cargador']);
            console.log('marina')
          }
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
