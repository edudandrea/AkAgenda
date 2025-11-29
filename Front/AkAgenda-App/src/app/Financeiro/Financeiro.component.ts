import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SchedulesService } from '../Services/Schedules.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Clients, ClientService } from '../Services/Client.service';
import { Professionals, ProfessionalService } from '../Services/Professional.service';
import { Servicos, ServicosService } from '../Services/Servicos.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
    selector: 'app-Financeiro',
    templateUrl: './Financeiro.component.html',
    styleUrls: ['./Financeiro.component.scss'],
    standalone: false
})
export class FinanceiroComponent implements OnInit {
  totalAgendamentos: number = 0;
  dataInicioSchedule: Date = new Date();
  dataFimschedule: Date = new Date();
  dataInicioFat: Date = new Date();
  dataFimFat: Date = new Date();
  totalFaturado: number = 0;
  hoje: Date = new Date();
  totalAgendadoHoje: number = 0;
  totalFaturadoHoje: number = 0;
  Schedules: any[] = [];
  filteredSchedules: any[] = [];
  clients: Clients[] = [];
  services: Servicos[] = [];
  professionals: any[] = [];  
  agendamentosPorProfissional: any[] = [];
  profissionalSelecionadoId: number | null =null
  listaDeProfissionais: any[] = [];
  professionalName: string = '';
  profissionalSelecionadoComissao: any [] = [];
  comissaoCalculada: number = 0;
  dataInicioComissao: Date = new Date();
  dataFimComissao: Date = new Date();
  lucroEstabelecimento: number = 0;
  bsConfig!: Partial<BsDatepickerConfig>;

  
  constructor(private scheduleService: SchedulesService,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService,
              private clientService: ClientService,
              private professionalService: ProfessionalService,
              private servicoService: ServicosService,              
              
  ) { }

  ngOnInit() {    
    this.bsConfig = {
      dateInputFormat: 'DD/MM/YYYY',
      containerClass: 'theme-modern',
      showWeekNumbers: false,      
    };    
    this.loadData();
    this.loadSchedule();     
    this.calcularTotalAgendamentos();
    this.calcularAgendamentosPorProfissional();
        
    
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
    this.professionalService.getProfessional().subscribe({      
      next: (data) => this.professionals  = data,      
      error: (err) => console.error('Erro ao buscar profissional', err)
    })
  
    // Carregar serviços
    this.servicoService.getServicos().subscribe((services) => {
      this.services = services;
    });
    

    }

    calcularAgendamentosPorProfissional(): void {
      console.log('Início:', this.dataInicioSchedule);
      console.log('Fim:', this.dataFimschedule);
      const inicio = new Date(this.dataInicioSchedule);
      inicio.setHours(0, 0, 0, 0); // Início do dia
      const fim = new Date(this.dataFimschedule);
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

    calcularTotalAgendamentos(): void {
      const inicio = new Date(this.dataInicioSchedule);
      const fim = new Date(this.dataFimschedule);
    
      this.totalAgendamentos = this.filteredSchedules.filter(schedule => {
        const data = new Date(schedule.scheduleDate);
        return data >= inicio && data <= fim;
      }).length;
    }

    countTodaySchedules(): number {
      const todayStr = new Date().toDateString();
    
      return this.filteredSchedules.filter(schedule => {
        const scheduleDateStr = new Date(schedule.scheduleDate).toDateString();
        return scheduleDateStr === todayStr;
      }).length;
    }

    isCompleted(scheduleDate: string): boolean {
      const now = new Date();
      const appointmentTime = new Date(scheduleDate);    
      return now.getTime() >= appointmentTime.getTime() + 60 * 60 * 1000;
    }

    countTodayFat(): number {
      const todayStr = new Date().toDateString();
    
      return this.filteredSchedules
        .filter(schedule =>
          new Date(schedule.scheduleDate).toDateString() === todayStr &&
          schedule.attended
        )
        .reduce((total, schedule) => {
          const servico = this.services.find(s => s.serviceId === schedule.serviceId);
          const valorServico = servico ? servico.price || 0 : 0;
          return total + valorServico;
        }, 0);
    }

    getProfessionalPhotoPath(professionalId: number): string {
      const professional = this.professionals.find(p => p.professionalId === professionalId);
      
      // Verifique se a propriedade photoUrl realmente existe
      const photoUrl = professional?.photoPath || '/assets/default-profile.jpg';
      
      console.log(`URL da foto do profissional (${professionalId}): ${photoUrl}`);
      
      return photoUrl;
    }

    calcularFaturamentoPorPeriodo(): void {
      if (!this.dataInicioFat || !this.dataFimFat) return;
    
      const inicio = new Date(this.dataInicioFat);
      const fim = new Date(this.dataFimFat);
      fim.setHours(23, 59, 59, 999); // Final do dia
    
      this.totalFaturado = this.Schedules
        .filter(schedule => {
          const dataAgendamento = new Date(schedule.scheduleDate);
          return dataAgendamento >= inicio &&
                 dataAgendamento <= fim &&
                 schedule.attended
        })
        .reduce((total, schedule) => {
          const servico = this.services.find(s => s.serviceId === schedule.serviceId);
          return total + (servico?.price || 0);
        }, 0);
    }

    loadSchedule(): void {
      this.spinner.show();
    
      // 1. Busca os agendamentos
      this.scheduleService.getSchedule().subscribe({
        next: (data) => {
          this.Schedules = data.map(schedule => ({
            ...schedule,
            scheduleDate: new Date(schedule.scheduleDate),
            appointmentDate: new Date(schedule.scheduleDate)
          }));
    
          // 2. Busca os profissionais
          this.professionalService.getProfessional().subscribe({
            next: (profissionais) => {
              // Cria um mapa de id => nome
              const profissionalMap = new Map<number, string>(
                profissionais.map(p => [p.professionalId, p.professionalName])
              );
    
              // 3. Monta a lista com os nomes dos profissionais usados nos agendamentos
              this.listaDeProfissionais = Array.from(
                new Map(
                  this.Schedules.map(s => [
                    s.professionalId,
                    profissionalMap.get(s.professionalId) || 'Desconhecido'
                  ])
                )
              ).map(([id, nome]) => ({ id, nome }));
    
              // 4. Filtra os agendamentos do dia
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
    
              this.toastr.success('Agendamentos carregados com sucesso!', 'Sucesso');
              console.log("✅ Agendamentos do dia:", this.filteredSchedules);
            },
            error: (err) => {
              this.toastr.error('Erro ao carregar profissionais!', 'Erro');
              console.error("❌ Erro ao buscar profissionais:", err);
            }
          });
        },
        error: (err) => {
          this.toastr.error('Erro ao carregar agendamentos!', 'Erro');
          console.error("❌ Erro ao buscar agendamentos:", err);
        }
      }).add(() => this.spinner.hide());
    }

    calcularComissao() {
    if (!this.professionals || this.professionals.length === 0) {
        console.warn("Lista de profissionais ainda não carregada.");
        return;
    }

    if (!this.profissionalSelecionadoComissao) {
        this.comissaoCalculada = 0;
        return;
    }

    // Aplicar filtro por período e profissional
    const inicio = new Date(this.dataInicioFat);
    const fim = new Date(this.dataFimFat);
    fim.setHours(23, 59, 59, 999); // Final do dia

    const faturamentoProfissional = this.Schedules
        .filter(schedule => {
            const dataAgendamento = new Date(schedule.scheduleDate);
            return dataAgendamento >= inicio &&
                dataAgendamento <= fim &&
                schedule.professionalId === this.profissionalSelecionadoComissao &&
                schedule.attended;
        })
        .reduce((total, schedule) => {
            const servico = this.services.find(s => s.serviceId === schedule.serviceId);
            if (!servico) return total;

            // 🔹 Se for Esmaltação em gel, aplica 70%, senão aplica 50%
            const comissao = servico.serviceName === "Esmaltação em Gel Mãos" || servico.serviceName === "Esmaltação em Gel Pés" ? 0.7 : 0.5; 
            return total + (servico.price * comissao);
        }, 0);

    this.comissaoCalculada = faturamentoProfissional;

    this.lucroEstabelecimento = this.totalFaturado - this.comissaoCalculada;

    console.log("✅ Comissão calculada:", this.comissaoCalculada);
}

}
