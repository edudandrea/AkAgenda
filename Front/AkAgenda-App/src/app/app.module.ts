import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CadastroClientesComponent } from './CadastroClientes/CadastroClientes.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DashboardComponent } from './Dashboard/Dashboard.component';
import { SchedulesComponent } from './Schedules/Schedules.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { AnamnesesComponent } from './Anamneses/Anamneses.component';
import { ServicosComponent } from './Servicos/Servicos.component';
import { ProfessionalComponent } from './Professional/Professional.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FinanceiroComponent } from './Financeiro/Financeiro.component';
import { ScheduleClientComponent } from './ScheduleClient/ScheduleClient.component';
import { SimpleLayoutComponent } from './SimpleLayout/SimpleLayout.component';
import { LayoutComponent } from './Layout/Layout.component';
import { LoginComponent } from './Login/Login.component';
import { CadastroUsuariosComponent } from './CadastroUsuarios/CadastroUsuarios.component';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
defineLocale('pt-br', ptBrLocale);




@NgModule({
  declarations: [														
    AppComponent,
      CadastroClientesComponent,
      DashboardComponent,
      SchedulesComponent,
      AnamnesesComponent,
      ServicosComponent,
      ProfessionalComponent,
      FinanceiroComponent,
      ScheduleClientComponent,
      SimpleLayoutComponent,
      LayoutComponent,
      LoginComponent,      
      CadastroUsuariosComponent
   ],
  imports: [
    BrowserModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    AppRoutingModule,
    NgxSpinnerModule,
    HttpClientModule,
    BrowserAnimationsModule,    
    ToastrModule.forRoot (
      {timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      progressBar: true,
      closeButton: true,
    }
  ),
    ModalModule.forRoot(),
    
    
    
    

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(private localeService: BsLocaleService) {
    this.localeService.use('pt-br');
  }

}
