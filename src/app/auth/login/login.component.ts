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

    ngOnInit(): void {
        if (this.authService.isAuthenticated()) {
            const role = this.authService.getRole();
            if (role === 'ADMINISTRADOR') {
                this.router.navigate(['/dashboard']);
            } else if (role === 'CARGADOR_RESOLUCIONES') {
                this.router.navigate(['/dashboard-cargador']);
            }
        }
    }

    onLogin() {
        this.authService.login(this.username, this.password).subscribe({
            next: (response) => {
                if (response.success) {
                    if (response.rol === 'ADMINISTRADOR') {
                        this.router.navigate(['/dashboard']);
                    } else if (response.rol === 'CARGADOR_RESOLUCIONES') {
                        this.router.navigate(['/dashboard-cargador']);
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

