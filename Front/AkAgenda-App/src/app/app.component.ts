import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {
  title = 'AkAgenda-App';
  isClientesMenuOpen = false;

  toggleClientesMenu() {
    this.isClientesMenuOpen = !this.isClientesMenuOpen;
  }
}


