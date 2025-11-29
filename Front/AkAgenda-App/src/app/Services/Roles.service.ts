import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './Auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard  {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const expectedRole = route.data['role'];
    const userRole = this.authService.getRole(); // Pega o papel do usuário logado

    if (userRole === expectedRole) {
      return true; // Se o papel do usuário for o esperado
    } else {
      this.router.navigate(['/access-denied']); // Se não, redireciona para uma página de acesso negado
      return false;
    }
  }
}
