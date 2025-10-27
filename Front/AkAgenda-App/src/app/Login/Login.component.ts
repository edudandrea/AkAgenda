import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../Services/Login.service';

@Component({
  selector: 'app-Login',
  templateUrl: './Login.component.html',
  styleUrls: ['./Login.component.scss']
})
export class LoginComponent implements OnInit {

  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, 
              private router: Router,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService,
              private loginService: LoginService) { }

  ngOnInit() {

  }

  onLogin() {
    this.loginService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.spinner.show();
        this.toastr.success('Login realizado com sucesso', 'Sucesso');
        this.spinner.hide();
  
        console.log('Resposta do login:', response);
  
        // Armazenando o token no localStorage
        const token = response.token;
        localStorage.setItem('token', token);
  
        // Decodificando o token para obter o papel (role)
        const decodedToken = this.decodeToken(token);
        console.log('Decoded token:', decodedToken);
        const role = decodedToken.role; 
        console.log('Role:', role); // Acessando o papel (role) do usuário do token
  
        // Armazenando o login e o papel do usuário como string
        localStorage.setItem('userLogin', response.users.login);
        
        localStorage.setItem('role', role); 

        console.log('Role armazenado no LocalStorage:', role);
  
        // Redirecionando com base no papel
        if (role === 'admin') {
          console.log('Redirecionando para /dashboard');
          this.router.navigate(['/dashboard']);
        } else if (role === 'user') {
          console.log('Redirecionando para /clientes');
          this.router.navigate(['/clientes']);
        } else {
          console.log('Role não encontrado, redirecionando para /login');
          this.router.navigate(['/login']);
        }
      },
      error: () => {
        this.toastr.error('Usuário ou senha inválidos', 'Erro');
        this.spinner.hide();
        this.errorMessage = 'Usuário ou senha inválidos';
      }
    });
  }

  decodeToken(token: string): any {
    const payload = token.split('.')[1];  // Pega o payload do token
    const decodedPayload = atob(payload);  // Decodifica o payload
    return JSON.parse(decodedPayload);  // Retorna o payload decodificado
  }
  

    onLogout(){

    }  
  

}
