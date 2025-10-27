import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.hasToken());
  private userRole: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(localStorage.getItem('role'));

  constructor(private router: Router) { }

  // Realiza o login, armazena token e role no localStorage
  login(token: string, role: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    this.loggedInSubject.next(true);
    this.userRole.next(role);  // Atualiza o papel do usuário
  }

  // Realiza o logout, remove token e role do localStorage
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.loggedInSubject.next(false);
    this.userRole.next(null);  // Limpa o papel ao fazer logout
    this.router.navigate(['/login']);
  }

  // Retorna se o usuário está logado (observável)
  isLoggedIn(): boolean {
    return this.loggedInSubject.value; // Retorna diretamente o valor do BehaviorSubject
  }

  // Retorna o papel do usuário diretamente
  getRole(): string | null{
    return localStorage.getItem('role');
  }

  // Método que verifica se o token existe no localStorage
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  // Função que decodifica o token JWT para extrair o papel
  decodeToken(token: string): any {
    const payload = token.split('.')[1];  // Pega o payload do token
    const decodedPayload = atob(payload);  // Decodifica o payload
    return JSON.parse(decodedPayload);  // Retorna o payload decodificado
  }
}


