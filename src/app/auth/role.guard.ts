import { CanActivate, Router, ActivatedRouteSnapshot } from "@angular/router";
import { AuthService } from "./auth.service";
import { Injectable } from "@angular/core";


@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const expectedRole = route.data['role'];
        const userRole = this.authService.getRole();

        if (this.authService.isAuthenticated() && userRole === expectedRole) {
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
}
