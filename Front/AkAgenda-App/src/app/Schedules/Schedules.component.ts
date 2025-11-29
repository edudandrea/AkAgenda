import { Component, OnInit, AfterViewInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Schedules, SchedulesService } from '../Services/Schedules.service';
import { Clients, ClientService } from '../Services/Client.service';
import { Servicos, ServicosService } from '../Services/Servicos.service';
import { Professionals, ProfessionalService } from '../Services/Professional.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';



@Component({
    selector: 'app-Schedules',
    templateUrl: './Schedules.component.html',
    styleUrls: ['./Schedules.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class SchedulesComponent implements OnInit {
  bsModalRef?: BsModalRef;
  startDate: Date | null = null;
  endDate: Date | null = null;  
  Schedules: any [] = [];
  ScheduleId: number = 0;  
  selectedSchedule: any = [];
  editedSchedule: any = [];
  ClientName: string = '';
  Compareceu: boolean = false;
  Professional: any = [];
  scheduleDesc: string = '';
  dateTimeConfig = {
    enableTime: true,        // Habilita a seleção de hora
    dateFormat: "Y-m-d H:i", // Formato de data e hora
    time_24hr: true          // Usar formato de 24 horas
  };
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

  clients: Clients[] = [];
  services: Servicos[] = [];
  professionals: Professionals[] = [];
  minDateTime: string = '';
  maxDateTime: string = '';
  searchDate: string = '';
  filteredSchedules: any [] = [];
  scheduleTime: string = '';
  availableTimes: string[] = [];

  searchTerm: string = '';
  filteredClients: any[] = [];
  bsConfig!: Partial<BsDatepickerConfig>;
  @ViewChild('modalContainer', { static: false }) modalContainer!: ElementRef;
   

  
  constructor(private scheduleService: SchedulesService,
              private servicoService: ServicosService,
              private professionalService: ProfessionalService,
              private clientService: ClientService,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService,
              private modal: BsModalService) { }

  ngOnInit() {
    this.setDateTimeLimits();
    this.loadClients();
    this.loadSchedule();
    this.loadServices();
    this.loadProfessionals();
    this.generateAvailableTimes();    
    this.bsConfig = {
      dateInputFormat: 'DD/MM/YYYY',
      containerClass: 'theme-modern',
      showWeekNumbers: false,  
      adaptivePosition: true,
      isAnimated: true    
    };
  }   

  generateAvailableTimes() {
    const startHour = 8;  // Início às 08:00
    const endHour = 20;   // Fim às 20:00
  
    this.availableTimes = [];
  
    for (let hour = startHour; hour <= endHour; hour++) {
      this.availableTimes.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < endHour) {
        this.availableTimes.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
  }  

  setDateTimeLimits() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Ajusta para dois dígitos
    const day = today.getDate().toString().padStart(2, '0'); // Ajusta para dois dígitos

    this.minDateTime = `${year}-${month}-${day}T08:00`;
    this.maxDateTime = `${year}-${month}-${day}T20:00`;
  } 

  filterSchedules(): void {
        if (!this.startDate || !this.endDate) {
          this.filteredSchedules = [];
          return;
        }

        // Clona as datas para evitar alterações inesperadas
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);

        // Define o intervalo do dia inicial e final
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        this.filteredSchedules = this.Schedules.filter(schedule => {
          const scheduleDate = new Date(schedule.scheduleDate);
          return scheduleDate >= start && scheduleDate <= end;
        });
      }

        setToday(): void {
        const today = new Date();
        
        this.startDate = new Date(today.setHours(0, 0, 0, 0)); // começa do início do dia
        this.endDate = new Date(today.setHours(23, 59, 59, 999)); // até o fim do dia

        this.filterSchedules();
      }


  openModalNew(template: any) {
    this.bsModalRef = this.modal.show(template, {class: 'modal-lg custom-modal',
                                                     ignoreBackdropClick: true,
                                                     backdrop: 'static'});{}      
  }

  openModalEdit(templateEdit: any, scheduleId: number) {    
    this.ScheduleId = scheduleId;
    this.bsModalRef = this.modal.show(templateEdit, {class: 'modal-lg custom-modal',
                                                     ignoreBackdropClick: true,
                                                     backdrop: 'static'})
    this.scheduleService.getScheduleById(scheduleId).subscribe({
      next: (data) => {
        if(data) {
          this.selectedSchedule = data;
          this.editedSchedule = {... data};

          if (!this.selectedSchedule.scheduleDesc || this.selectedSchedule.scheduleDesc.trim() === '') {
            this.selectedSchedule.scheduleDesc = 'Sem descrição';
          }
          console.log('Agendamento carregado:', this.editedSchedule); 
          this.toastr.success('Agendamento carregado com sucesso!', 'Sucesso');
           
        }
        else{
          this.toastr.warning('Serviço não encontrado!', 'Aviso');
        }
      },
      error: (err) => {
        console.error('Erro ao carregar Serviço', err);
        this.toastr.error('Erro ao carregar Serviço!', 'Erro');
      }
    });
    
  }

  loadClients(): void {
    
    this.clientService.getClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.spinner.hide();
      },
      error: (err) => {
        console.error('Erro ao carregar clientes', err);
        this.toastr.error('Erro ao carregar clientes!', 'Erro');
        
      },
    });
  }

  loadServices(): void{
    this.servicoService.getServicos().subscribe({
      next: (data) => {        
        this.services = data;
        
      },
      error: (err) =>{
        this.toastr.error('Erro ao carregar serviços!', 'Erro');
        console.error('Erro ao buscar serviços', err)
        
      } 
    })
  }
  getProfessionalPhotoPath(professionalId: number): string {
    const professional = this.professionals.find(p => p.professionalId === professionalId);
    
    // Verifique se a propriedade photoUrl realmente existe
    const photoUrl = professional?.photoPath || '/assets/default-profile.jpg';
    
    console.log(`URL da foto do profissional (${professionalId}): ${photoUrl}`);
    
    return photoUrl;
  }

  loadSchedule(): void {
    this.spinner.show();
    
    // Usa a data escolhida pelo usuário, ou a data do dia se estiver vazia
    const selectedDate = this.searchDate && this.searchDate.trim() !== ''
      ? new Date(this.searchDate)
      : new Date(); 

    console.log("🔍 Data utilizada na pesquisa:", selectedDate.toISOString().split('T')[0]);

    this.scheduleService.getSchedule().subscribe({
      next: (data) => {        
        this.Schedules = data.map(schedule => ({
          ...schedule,
          scheduleDate: new Date(schedule.scheduleDate),
          appointmentDate: new Date(schedule.scheduleDate)
        }));

        // Filtra os agendamentos com base na `selectedDate`
        this.filteredSchedules = this.Schedules.filter(schedule => {
          const scheduleDate = schedule.scheduleDate;
          return scheduleDate.getFullYear() === selectedDate.getFullYear() &&
                 scheduleDate.getMonth() === selectedDate.getMonth() &&
                 scheduleDate.getDate() === selectedDate.getDate();
        });

        this.filteredSchedules.sort((a, b) => a.scheduleDate.getTime() - b.scheduleDate.getTime());

        this.toastr.success(`Agendamentos carregados!`, 'Sucesso');        
      },
      error: (err) => {
        this.toastr.error('Erro ao carregar agendamentos!', 'Erro');
        console.error("❌ Erro ao buscar agendamentos:", err);
      }
    }).add(() => this.spinner.hide());
}


  loadProfessionals(): void {
    this.professionalService.getProfessional().subscribe({      
      next: (data) => this.professionals = data,      
      error: (err) => console.error('Erro ao buscar profissional', err)
    })
  }

  addSchedule(): void {
    console.log('ClientId selecionado:', this.schedule.clientId); 
  
    // Validações
    if (!this.schedule.clientId || !this.schedule.scheduleDate || !this.scheduleTime ||
        !this.schedule.servicoAgendado || !this.schedule.professional) {
      this.toastr.error('Todos os campos são obrigatórios!');
      return;
    }
  
    const selectedClient = this.clients.find(client => client.clientId == this.schedule.clientId);
  
    if (!selectedClient) {
      console.error('Erro: Cliente não encontrado!');
      this.toastr.error('Cliente não encontrado!');
      return;
    }
  
    // Junta a data com a hora selecionada
    const [hours, minutes] = this.scheduleTime.split(':').map(Number);
    const selectedDate = new Date(this.schedule.scheduleDate);
    selectedDate.setHours(hours, minutes, 0, 0);
   
    
    const scheduleData = {
      clientId: this.schedule.clientId,
      clientName: selectedClient.clientName,
      serviceId: this.schedule.servicoAgendado,
      professionalId: this.schedule.professional,
      scheduleDate: selectedDate, // Mantém o horário correto sem ajustes de fuso
      clienteName: this.ClientName,
      servicoAgendado: this.schedule.servicoAgendado,
      professional: this.schedule.professional,
      scheduleDesc: this.scheduleDesc,
      bookingCount: this.schedule.bookingCount,
      phoneNumber: this.schedule.phoneNumber,
      email: this.schedule.email
    };
  
    console.log('📤 Agendamento a ser enviado:', scheduleData);
  
    // Envio
    this.spinner.show();
    this.scheduleService.addSchedule(scheduleData).subscribe({
      next: (response) => {
        console.log('✅ Agendamento criado com sucesso:', response);
        this.toastr.success('Agendamento criado com sucesso!');
        this.bsModalRef?.hide();        
        this.spinner.hide();
        this.loadSchedule();
      },
      error: (err) => {
        console.error('❌ Erro ao criar agendamento:', err);
        this.toastr.error('Erro ao criar agendamento!');
        this.spinner.hide();
      }
    });
  }
  

  editSchedule(): void {
    if (!this.selectedSchedule || !this.editedSchedule.scheduleDate || !this.editedSchedule.scheduleTime) {
        this.toastr.warning('Preencha todos os campos!', 'Erro');
        return;
    }

    // Pegar a data do input (YYYY-MM-DD)
    const [year, month, day] = this.editedSchedule.scheduleDate.split('-').map(Number);
    const [hours, minutes] = this.editedSchedule.scheduleTime.split(':').map(Number);

    // Criar um novo objeto Date usando os valores individuais (sem conversão automática de fuso horário)
    const selectedDate = new Date(year, month - 1, day, hours, minutes);

    // Criar objeto atualizado
    const updateSchedule = {
        ...this.selectedSchedule,
        clientId: this.editedSchedule.clientId || this.selectedSchedule.clientId,
        clientName: this.editedSchedule.clientName || this.selectedSchedule.clientName,
        serviceId: Number(this.editedSchedule.servicoAgendado) || this.selectedSchedule.serviceId,
        professionalId: this.editedSchedule.professional || this.selectedSchedule.professionalId,
        scheduleDate: selectedDate.toISOString(), // Mantém o horário correto sem ajustes de fuso
        scheduleTime: this.editedSchedule.scheduleTime
    };

    console.log('✅ Dados enviados para edição:', updateSchedule);
    console.log("📌 Client ID antes do envio:", updateSchedule.clientId);

    
    this.scheduleService.editSchedules(updateSchedule).subscribe({
        next: (response) => {
          console.log('🔄 Resposta do backend:', response);

            this.toastr.success('Agendamento editado com sucesso!', 'Sucesso');
            this.bsModalRef?.hide();
            this.spinner.hide();
            this.loadSchedule();
        },
        error: (err) => {
            console.error('Erro ao editar agendamento', err);
            this.toastr.error('Erro ao editar agendamento!', 'Erro');
        }
    });
  }


  deleteSchedules(scheduleId: number): void {
    if(confirm('Deseja realmente excluir este agendamento?')) {
      this.spinner.show();
      this.scheduleService.deleteSchedules(scheduleId).subscribe({
        next: () => {
          console.log(scheduleId);
          this.toastr.success('Agendamento excluído com sucesso!', 'Sucesso');
          this.loadSchedule();
        },
        error: (err) => {
          console.error('Erro ao excluir agendamento', err);
          this.toastr.error('Erro ao excluir agendamento!', 'Erro');
          this.spinner.hide();
        }
      });
    }
  } 

  getClientName(clientId: number): string {    
    const client = this.clients.find(c => c.clientId === clientId);

    if (!client) {
      console.warn(`Cliente com ID ${clientId} não encontrado.`);
    }
    return client ? client.clientName : 'Não informado';
  }
  
  getServiceName(serviceId: number): string {
    const service = this.services.find(s => s.serviceId === serviceId);
    return service ? service.serviceName : '—';
  }
  
  getProfessionalName(professionalId: number): string {
    const professional = this.professionals.find(p => p.professionalId === professionalId);
    return professional ? professional.professionalName : '—';
  }
  
  getProfessionalPhoto(professionalId: number): string {
    const professional = this.Professional.find((p: { professionalId: number; PhotoPath?: string }) => p.professionalId === professionalId);
    
    if (professional && professional.PhotoPath) {
      return `https://localhost:7254/uploads/${professional.PhotoPath}`;
    }
  
    return 'assets/default-profile.jpg'; 
  }

  formatDate(dateString: string): string {
    if (!dateString) return "Sem data"; 
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Data inválida"; 
    
    return date.toLocaleString("pt-BR", { 
      day: "2-digit", 
      month: "2-digit", 
      year: "2-digit", 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  }

  isAppointmentTime(scheduleDate: string): boolean {
    const now = new Date();
    const appointmentTime = new Date(scheduleDate);   
    return appointmentTime <= now && now < new Date(appointmentTime.getTime() + 60 * 60 * 1000);
  }

  isCompleted(scheduleDate: string): boolean {
    const now = new Date();
    const appointmentTime = new Date(scheduleDate);    

    return now.getTime() >= appointmentTime.getTime() + 60 * 60 * 1000;
  }

  toggleAttendance(schedule: any, attended: boolean = true): void {
    schedule.attended = attended;
    this.filteredSchedules = [...this.filteredSchedules];
    this.scheduleService.updateAttendance(schedule.scheduleId, attended).subscribe({
        next: () => this.toastr.success('Presença atualizada com sucesso!', 'Sucesso'),
        error: () => this.toastr.error('Erro ao atualizar presença!', 'Erro')
    });
}

    filtrarClientes() {
      this.filteredClients = this.clients.filter(client =>
        client.clientName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    selecionarCliente(client: any) {
      this.schedule.clientId = client.clientId;
      this.editedSchedule.clientId = client.clientId;
      this.searchTerm = client.clientName; // Exibe o nome do cliente selecionado
      this.filteredClients = []; // Limpa a lista após a seleção
      console.log("Cliente selecionado:", client);

      

    }

    
}
