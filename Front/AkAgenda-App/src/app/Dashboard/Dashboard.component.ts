import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Schedules, SchedulesService } from '../Services/Schedules.service';
import { Servicos, ServicosService } from '../Services/Servicos.service';
import { Professionals, ProfessionalService } from '../Services/Professional.service';
import { Clients, ClientService } from '../Services/Client.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-Dashboard',
  templateUrl: './Dashboard.component.html',
  styleUrls: ['./Dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  @ViewChild('topClientsChart') topClientsChart!: ElementRef<HTMLCanvasElement>;
  bsModalRef?: BsModalRef
  topClients: Schedules[] = [];
  Schedules: any[] = [];
  filteredSchedules: any[] = [];
  clients: Clients[] = [];
  services: Servicos[] = [];
  professionals: Professionals[] = [];
  agendamentosPorProfissional: any[] = [];
  dataInicioSchedule: Date | null = null;
  dataFimSchedule: Date | null = null;
  bsConfig!: Partial<BsDatepickerConfig>;  
  profissionalSelecionadoId: number | null =null  
  

  schedule: Schedules = {
    scheduleId: 0,
    clientId: 0,
    clientName: '',
    phoneNumber: '',
    email: '',
    scheduleDate: new Date(),
    servicoAgendado: '',
    professional: '',
    scheduleDesc: '',
    bookingCount: 0
    
    
  };


  constructor(private scheduleService: SchedulesService,
              private servicoService: ServicosService,
              private professionalService: ProfessionalService,
              private clientService: ClientService,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService,
                       
              ) { }

  ngOnInit() { 
    this.bsConfig = {
      dateInputFormat: 'DD/MM/YYYY',
      containerClass: 'theme-modern',
      showWeekNumbers: false, 
      isAnimated: true     
    };   
    this.loadData();
    this.loadSchedule();
   setInterval(() =>{
      this.loadSchedule();
    }, 500000);
    
  }  

  loadSchedule(): void {
    this.spinner.show();
    this.scheduleService.getSchedule().subscribe({
      next: (data) => {        
        this.Schedules = data.map(schedule => ({
          ...schedule,
          scheduleDate: new Date(schedule.scheduleDate),
          appointmentDate: new Date(schedule.scheduleDate)
        }));
  
        const now = new Date();
        const todayYear = now.getFullYear();
        const todayMonth = now.getMonth();
        const todayDate = now.getDate();
  
        this.filteredSchedules = this.Schedules.filter(schedule => {
          const sched = schedule.scheduleDate;
          return (
            sched.getFullYear() === todayYear &&
            sched.getMonth() === todayMonth &&
            sched.getDate() === todayDate
          );
        });

        this.filteredSchedules.sort((a, b) => a.scheduleDate.getTime() - b.scheduleDate.getTime());
  
        this.toastr.success('Agendamentos carregados com sucesso!', 'Sucesso');
        console.log("✅ Agendamentos do dia:", this.filteredSchedules);
      },
      error: (err) => {
        this.toastr.error('Erro ao carregar agendamentos!', 'Erro');
        console.error("❌ Erro ao buscar agendamentos:", err);
      }
    }).add(() => this.spinner.hide());
  }

  countTodaySchedules(): number{
    const todayStr = new Date().toDateString();
    
      return this.filteredSchedules.filter(schedule => {
        const scheduleDateStr = new Date(schedule.scheduleDate).toDateString();
        return scheduleDateStr === todayStr;
      }).length;
    } 

  calcularAgendamentosPorProfissional(): void {
    if (!this.dataInicioSchedule || !this.dataFimSchedule) {
    console.warn('Datas não selecionadas');
    this.agendamentosPorProfissional = [];
    return;
  }
    console.log('Início:', this.dataInicioSchedule);
      console.log('Fim:', this.dataFimSchedule);
      const inicio = new Date(this.dataInicioSchedule);
      inicio.setHours(0, 0, 0, 0); // Início do dia
      const fim = new Date(this.dataFimSchedule);
      fim.setHours(23, 59, 59, 999); // Final do dia

      const mapa = new Map<number, { nome: string, totalAgendamentos: number }>();
    
      this.Schedules.forEach(schedule => {
        const dataAgendada = new Date(schedule.scheduleDate);
        const profId = schedule.professionalId;
    
        if (
          dataAgendada >= inicio && 
          dataAgendada <= fim &&
          (this.profissionalSelecionadoId == null || this.profissionalSelecionadoId === profId)
        ) {
          const nomeProf = schedule.professionalName;
    
          if (!mapa.has(profId)) {
            mapa.set(profId, { nome: nomeProf, totalAgendamentos: 1 });
          } else {
            mapa.get(profId)!.totalAgendamentos++;
          }
        }
      });
    
      this.agendamentosPorProfissional = Array.from(mapa.values());
    }

  

  filterSchedules(): void {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  
    this.scheduleService.getSchedule().subscribe({
      next: (schedules: any[]) => {
        this.Schedules = schedules;
        this.filteredSchedules = schedules.filter(schedule => {
          const scheduleDate = new Date(schedule.scheduleDate);
          return scheduleDate >= startOfDay && scheduleDate <= endOfDay;
        });
      },
      error: (err) => {
        console.error('Erro ao buscar agendamentos', err);
      }
    });
  }

  getProfessionalPhotoPath(professionalId: number): string {
    const professional = this.professionals.find(p => p.professionalId === professionalId);
    
    // Verifique se a propriedade photoUrl realmente existe
    const photoUrl = professional?.photoPath || '/assets/default-profile.jpg';
    
    console.log(`URL da foto do profissional (${professionalId}): ${photoUrl}`);
    
    return photoUrl;
  }

  getClientName(clientId: number): string {    
    const client = this.clients.find(c => c.clientId === clientId);

    if (!client) {
      console.warn(`Cliente com ID ${clientId} não encontrado.`);
    }
    return client ? client.clientName : 'Não informado';
  }

  getProfessionalName(professionalId: number): string {
    const professional = this.professionals.find(p => p.professionalId === professionalId);
    return professional ? professional.professionalName : '—';
  }

  getServiceName(serviceId: number): string {
    const service = this.services.find(s => s.serviceId === serviceId);
    return service ? service.serviceName : '—';
  }


  loadData(): void {
    this.clientService.getClients().subscribe((clients) => {
      this.clients = clients;
    });
  
    // Carregar profissionais
    this.professionalService.getProfessional().subscribe((professionals) => {
      this.professionals = professionals;
    });
  
    // Carregar serviços
    this.servicoService.getServicos().subscribe((services) => {
      this.services = services;
    });    

    }

    isAppointmentTime(scheduleDate: string): boolean {
      const now = new Date();
      const appointmentTime = new Date(scheduleDate);

      // Exemplo da lógica igual ao C#
      return now >= appointmentTime && now < new Date(appointmentTime.getTime() + 60 * 60 * 1000);
    }

      isCompleted(scheduleDate: string): boolean {
        const now = new Date();
        const appointmentTime = new Date(scheduleDate);    

        return now.getTime() >= appointmentTime.getTime() + 60 * 60 * 1000;
      }

}
