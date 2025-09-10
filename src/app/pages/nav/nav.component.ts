import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

   constructor(private router: Router, private authService: AuthService) {}

  irADash(){
    this.router.navigate(['/dashboard-cargador']);
  }

  cerrarSesion() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Vas a cerrar tu sesión actual',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Llamamos a logout del AuthService
        this.authService.logout();

        Swal.fire({
          icon: 'success',
          title: 'Sesión cerrada',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }
}
