import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../Services/Login.service';

@Component({
  selector: 'app-Login',
  templateUrl: './Login.component.html',
  styleUrls: ['./Login.component.scss'],
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private loginService: LoginService
  ) {}

  ngOnInit() {}

  onLogin() {
    this.loginService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.spinner.show();

        console.log('Resposta do login:', response);

        // 1) Pega e salva o token
        const token = response.token;
        if (!token) {
          this.spinner.hide();
          this.toastr.error('Token não retornado pelo servidor.', 'Erro');
          return;
        }

        localStorage.setItem('token', token);

        // 2) Decodifica o token com try/catch
        let decodedToken: any;
        try {
          decodedToken = this.decodeToken(token);
          console.log('Decoded token:', decodedToken);
        } catch (e) {
          console.error('Erro ao decodificar token:', e);
          this.spinner.hide();
          this.toastr.error(
            'Erro ao processar o token de autenticação.',
            'Erro'
          );
          return;
        }

        // 3) Pega a role (cobrindo formatos comuns do ASP.NET)
        let role =
          decodedToken.role ||
          decodedToken['role'] ||
          decodedToken[
            'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
          ];

        if (Array.isArray(role)) {
          role = role[0]; // se vier array de roles
        }

        console.log('Role bruta do token:', role);

        const roleNormalized = role ? String(role).toLowerCase() : null;
        console.log('Role normalizada:', roleNormalized);

        // 4) Salva login do usuário se existir
        if (response.users && response.users.login) {
          localStorage.setItem('userLogin', response.users.login);
        } else if (response.login) {
          // fallback caso o backend envie assim
          localStorage.setItem('userLogin', response.login);
        } else {
          console.warn('Login do usuário não encontrado na resposta.');
        }

        // 5) Salva role (mesmo que seja nula pra debug)
        if (roleNormalized) {
          localStorage.setItem('role', roleNormalized);
        }

        this.toastr.success('Login realizado com sucesso', 'Sucesso');
        this.spinner.hide();

        // 6) Redireciona com base na role
        if (roleNormalized === 'admin') {
          console.log('Redirecionando para /dashboard');
          this.router.navigate(['/dashboard']);
        } else if (roleNormalized === 'user') {
          console.log('Redirecionando para /clientes');
          this.router.navigate(['/clientes']);
        } else {
          console.warn(
            'Role não reconhecida ou ausente. Redirecionando para rota padrão.'
          );
          // 👇 Aqui você escolhe onde quer mandar se não tiver role
          this.router.navigate(['/dashboard']); // ou '/home' ou '/clientes'
        }
      },
      error: (err) => {
        console.error('Erro no login:', err);
        this.toastr.error('Usuário ou senha inválidos', 'Erro');
        this.spinner.hide();
        this.errorMessage = 'Usuário ou senha inválidos';
      },
    });
  }

  decodeToken(token: string): any {
    const payload = token.split('.')[1]; // Pega o payload do token
    const decodedPayload = atob(payload); // Decodifica o payload
    return JSON.parse(decodedPayload); // Retorna o payload decodificado
  }

  onLogout() {}
}
