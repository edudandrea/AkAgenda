import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../Services/Auth.service';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-Layout',
    templateUrl: './Layout.component.html',
    styleUrls: ['./Layout.component.scss'],
    standalone: false
})
export class LayoutComponent implements OnInit {

  title = 'AkAgenda-App';
  isClientesMenuOpen = false;
  role: string | null = null;
  sidebarOpen = false;

  constructor(private router: Router,
              private modalService: BsModalService,
              public authService: AuthService
  ) { }

  ngOnInit() {
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    this.modalService.hide();
  }

  toggleClientesMenu() {
    this.isClientesMenuOpen = !this.isClientesMenuOpen;
  }

  onLogout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    const role = localStorage.getItem('role');
    return role === 'admin';  // Verifica se o usuário tem o papel de admin
  }  

}
