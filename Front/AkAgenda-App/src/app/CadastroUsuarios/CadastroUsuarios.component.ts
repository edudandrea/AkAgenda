import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Users, UsersService } from '../Services/Users.service';

@Component({
    selector: 'app-CadastroUsuarios',
    templateUrl: './CadastroUsuarios.component.html',
    styleUrls: ['./CadastroUsuarios.component.scss'],
    standalone: false
})
export class CadastroUsuariosComponent implements OnInit {
  bsModalRef?: BsModalRef
  userId: number = 0;
  login: string = '';
  userName: string = '';
  password: string = '';
  function: string = '';
  selectedUser: any = [];
  selectedFunction: string = '';
  users: any[] = [];
  filteredUsers: any[] = [];
  searchTerm: string = '';
  editedUser: any = [];
  showPassword = false;


  constructor(private spinner: NgxSpinnerService,
              private toastr: ToastrService,
              private userService: UsersService,
              private modal: BsModalService
  ) { }

  ngOnInit() {
    this.loadUsers();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  searchUsers(): void{
    if(this.searchTerm){
      this.filteredUsers = this.users.filter(user => 
        user.userName.toLowerCase().includes(this.searchTerm.toLowerCase()));
    } else {
      this.filteredUsers = [...this.login];
    }
  }

  openModal(template: any) {
    this.bsModalRef = this.modal.show(template, {class: 'modal-lg custom-modal',
                                                     ignoreBackdropClick: true,
                                                     backdrop: 'static'});
  }

  openModalEdit(templateEdit: any, userId: number) {    
    console.log('Usuário ID recebido:', userId); 
          
    this.userId = userId;

    this.bsModalRef = this.modal.show(templateEdit, {class: 'modal-lg custom-modal',
                                                     ignoreBackdropClick: true,
                                                     backdrop: 'static'});

    this.userService.getUserById(userId).subscribe({
      next: (data) => { 
        if (data) {
          this.selectedUser = data;
          this.editedUser = { 
            userName: this.selectedUser.userName, 
            password: '',
            function: this.selectedUser.function
          };
          console.log('Usuário carregado:', this.editedUser);
          this.toastr.success('Usuário carregado com sucesso!', 'Sucesso');
        } else {
          this.toastr.warning('Usuário não encontrado!', 'Aviso');
        }
      },
      error: (err) => {
        console.error('Erro ao carregar usuário', err);
        this.toastr.error('Erro ao carregar usuário!', 'Erro');
      }
    });
}

    

    loadUsers(): void {
      this.spinner.show();
      this.userService.getUsers().subscribe({
        next: (data) => {
          console.log(data);
          if (!data || data.length === null) {  
            this.toastr.warning('Nenhum usuário cadastrado', 'Aviso');
            this.users = []; 
            this.filteredUsers = [];
            return;
        }   
          if(Array.isArray(data)) {
            this.users = data
            .filter(user => user.login && user.userName)
            .sort((a, b) => a.userName.localeCompare(b.userName || ''))
            .slice(0, 10);
            
            this.filteredUsers = [...this.users];         
            this.toastr.success('Usuário carregados com sucesso!', 'Sucesso');
            } else {
              this.toastr.error('Erro ao carregar usuário!', 'Erro');
            }
          },
            error: (err) => {
              console.error('Erro ao carregar usuário', err);
              this.toastr.error('Erro ao carregar usuário!', 'Erro');
              this.spinner.hide();                
            }, 
            
            complete: () => {
              this.spinner.hide();
            }
        });    
      }

  addUser() {
    
      const user ={ 
        userId: this.userId,       
        login: this.login,
        userName: this.userName,
        password: this.password,
        function: this.selectedFunction
      };  

      const token = localStorage.getItem('token'); // Supondo que você salvou o token no login
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      console.log("Dados enviados para o backend:", user);
      this.spinner.show();
      if(!this.login || !this.userName || !this.password) {
        this.toastr.warning('Preencha todos os campos!', 'Erro');
        this.spinner.hide();
        return;
      }
      this.userService.addUsers(user).subscribe({
        next: () => {
          this.toastr.success('Usuário cadastrado com sucesso!', 'Sucesso');
          this.bsModalRef?.hide();
          this.spinner.hide();   
          this.loadUsers();       
        },
        error: (error) => {
          console.error("Erro ao cadastrar:", error);
          this.toastr.error('Erro ao cadastrar o usuário!', 'Erro');
          this.spinner.hide();
        }
      });
  }

  deleteUser(userId: number, userLogin: string): void {

    const loggedInUserLogin = localStorage.getItem('userLogin');

    console.log('ID do usuário logado:', loggedInUserLogin);
    console.log('ID do usuário que estou tentando excluir:', userLogin);

    // Verificando se o loggedInUserId não é null antes de fazer o parseInt
    if (loggedInUserLogin && loggedInUserLogin === userLogin) {
      this.toastr.warning('Você não pode excluir seu próprio usuário!', 'Erro');
      return;
    }
    if(confirm('Deseja realmente excluir este usuário?')) {
      this.spinner.show();
      this.userService.deleteUsers(userId).subscribe({
        next: () => {
          console.log(userId);
          this.toastr.success('Usuário excluído com sucesso!', 'Sucesso');
          this.loadUsers();
          this.spinner.hide();
        },
        error: (err) => {
          console.error('Erro ao excluir Usuário', err);
          this.toastr.error('Erro ao excluir Usuário!', 'Erro');
          this.spinner.hide();
        }
      });
    }
  }    

  editUser(): void {
    if (!this.selectedUser) {
      this.toastr.warning('Selecione um usuário para editar!', 'Erro');
      return;
    }
  
    // Se a senha não for alterada (campo vazio), não manda alteração de senha
    const senhaAlterada = this.editedUser.password && this.editedUser.password.trim() !== '';
  
    if (!senhaAlterada) {
      delete this.editedUser.password;
    }
  
    const updateUser = { ...this.selectedUser, ...this.editedUser };
    delete updateUser.userId; // Garante que o ID não será alterado
  
    if (Object.keys(this.editedUser).length === 0) {
      this.toastr.warning('Nenhum campo foi alterado!', 'Erro');
      return;
    }
  
    console.log("Dados enviados para o backend:", updateUser);
    this.spinner.show(); // << Faltou colocar o spinner aqui antes da chamada
  
    this.userService.editUsers(this.selectedUser.userId, updateUser).subscribe({
      next: (data) => {
        if (senhaAlterada && data?.token) { // Só atualiza o token se senha foi alterada e o backend mandou um novo
          localStorage.setItem('token', data.token);
        }
  
        this.toastr.success('Usuário editado com sucesso!', 'Sucesso');
        this.bsModalRef?.hide();
        this.spinner.hide();
        this.loadUsers();
      },
      error: (err) => {
        console.error("Erro ao editar usuário:", err);
        this.toastr.error('Erro ao editar o usuário!', 'Erro');
        this.spinner.hide();
      }
    });
  }
  


}
