import { Injectable } from '@angular/core';
import { AuthService } from './Auth.service';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuardService  {

constructor(private authService: AuthService, 
            private router: Router) { }

            canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
              if (this.authService.isLoggedIn()) {
                const role = this.authService.getRole();
                console.log('Role no Guard:', role);
            
                const routePath = state.url;
                console.log('Route URL no Guard:', routePath);  // Usando route.url para capturar o path da URL da rota
            
                // Admin tem permissão total
                if (role === 'admin') {
                  return true;
                }
            
                // Usuário tem acesso apenas a 'clientes' e 'schedules'
                if (role === 'user' && (routePath === '/clientes' || routePath === '/schedules')) {
                  return true;
                }
            
                // Redireciona para login se não tiver permissão
                this.router.navigate(['/login']);
                return false;
              } else {
                // Se o usuário não estiver logado, redireciona para o login
                this.router.navigate(['/login']);
                return false;
              }
            }
          }

