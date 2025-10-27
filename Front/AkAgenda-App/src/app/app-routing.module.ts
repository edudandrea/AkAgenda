import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CadastroClientesComponent } from './CadastroClientes/CadastroClientes.component';
import { DashboardComponent } from './Dashboard/Dashboard.component';
import { SchedulesComponent } from './Schedules/Schedules.component';
import { AnamnesesComponent } from './Anamneses/Anamneses.component';
import { ServicosComponent } from './Servicos/Servicos.component';
import { ProfessionalComponent } from './Professional/Professional.component';
import { FinanceiroComponent } from './Financeiro/Financeiro.component';
import { LayoutComponent } from './Layout/Layout.component';
import { LoginComponent } from './Login/Login.component';
import { CadastroUsuariosComponent } from './CadastroUsuarios/CadastroUsuarios.component';
import { GuardService } from './Services/Guard.service';
import { SimpleLayoutComponent } from './SimpleLayout/SimpleLayout.component';
import { ScheduleClientComponent } from './ScheduleClient/ScheduleClient.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [GuardService],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'clientes', component: CadastroClientesComponent },
      { path: 'schedules', component: SchedulesComponent },
      { path: 'anamneses', component: AnamnesesComponent },
      { path: 'servicos', component: ServicosComponent },
      { path: 'profissionais', component: ProfessionalComponent },
      { path: 'financeiro', component: FinanceiroComponent },
      { path: 'users', component: CadastroUsuariosComponent },
    ]
  },

  {
    path: 'public',
    component: SimpleLayoutComponent,
    children: [
      { path: 'agendar', component: ScheduleClientComponent }
    ]
  },

  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
