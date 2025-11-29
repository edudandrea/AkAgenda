import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Clients, ClientService } from '../Services/Client.service';
import { Servicos, ServicosService } from '../Services/Servicos.service';
import {
  Professionals,
  ProfessionalService,
} from '../Services/Professional.service';
import { Schedules, SchedulesService } from '../Services/Schedules.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AnamnesesService } from '../Services/Anamneses.service';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
    selector: 'app-ScheduleClient',
    templateUrl: './ScheduleClient.component.html',
    styleUrls: ['./ScheduleClient.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class ScheduleClientComponent implements OnInit {
  bsModalRef?: BsModalRef;
  Schedules: any[] = [];
  ScheduleId: number = 0;
  selectedSchedule: any = [];
  editedSchedule: any = [];
  ClienteName: string = '';
  Compareceu: boolean = false;
  Professional: any = [];
  scheduleDesc: string = '';
  dateTimeConfig = {
    enableTime: true,
    dateFormat: 'Y-m-d H:i',
  };

  searchTerm: string = '';
  mostrarLista: boolean = false;

  ClientId: number = 0;
  Profession: string = '';
  ClientName: string = '';
  Address: string = '';
  City: string = '';
  State: string = '';
  PhoneNumber: string = '';
  ClientEmail: string = '';
  Facebook: string = '';
  Instagram: string = '';
  anamneses: any[] = [];
  selectedAnamnese: any[] = [];

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
    bookingCount: 0,
  };
  Clients: Clients[] = [];
  filteredClients: Clients[] = [];
  services: Servicos[] = [];
  professionals: Professionals[] = [];
  minDateTime: string = '';
  maxDateTime: string = '';
  searchDate: string = '';
  filteredSchedules: any[] = [];
  filteredServices: any[] = [];
  filteredProfessionals: Professionals[] = [];
  scheduleTime: string = '';
  availableTimes: string[] = [];
  occupiedTimes: string[] = []; // será preenchido com os horários ocupados no dia/profissional
  filteredTimes: string[] = []; // horários realmente disponíveis
  Servicos: any[] = [];
  bsConfig!: Partial<BsDatepickerConfig>;
  availableHours: string[] = [];
  allHours: string[] = [
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
  ];

  @ViewChild('autoShownModal', { static: true }) autoShownModal: any;

  constructor(
    private modal: BsModalService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private scheduleService: SchedulesService,
    private clientService: ClientService,
    private anamneseService: AnamnesesService,
    private router: Router,
    private professionalService: ProfessionalService,
    private servicoService: ServicosService
  ) {}

  ngOnInit() {
    this.bsModalRef = this.modal.show(this.autoShownModal, {
      class: 'modal-lg custom-modal',
    });
    {
    }
    this.LoadAnamneses();
    this.loadClients();
    this.loadProfessionals();
    this.loadServices();
    this.setDateTimeLimits();
    this.generateAvailableTimes();
    this.bsConfig = {
      daysDisabled: [0, 1],
      dateInputFormat: 'DD/MM/YYYY',
      containerClass: 'theme-modern',
      showWeekNumbers: false,
    };
  }

  fecharModal(): void {
    this.bsModalRef?.hide();
  }

  openModalNew(template: any) {
    this.bsModalRef?.hide();
    this.bsModalRef = this.modal.show(template, {
      class: 'modal-lg custom-modal',
      ignoreBackdropClick: true,
      backdrop: 'static',
    });
    {
    }
  }

  fecharLista() {
    this.mostrarLista = false;
  }

  filtrarClientes() {
    if (this.searchTerm.trim() === '') {
      this.filteredClients = [];
      return;
    }
    this.filteredClients = this.Clients.filter((client) =>
      client.clientName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  selecionarCliente(client: any) {
    this.schedule.clientId = client.clientId;
    this.editedSchedule.clientId = client.clientId;
    this.searchTerm = client.clientName;
    this.schedule.phoneNumber = client.phoneNumber;   // ou client.telefone, conforme o nome da propriedade
    this.schedule.email = client.clientEmail; // Exibe o nome do cliente selecionado
    this.filteredClients = [];    
    console.log('Cliente selecionado:', client);
  }

  loadClients(): void {
    this.spinner.show();
    this.clientService.getClients().subscribe({
      next: (data) => {
        console.log(data);
        if (!data || data.length === null) {
          this.Clients = [];
          this.filteredClients = [];
          return;
        }
        if (Array.isArray(data)) {
          this.Clients = data
            .filter((client) => client.clientId && client.clientName)
            .sort((a, b) => a.clientName.localeCompare(b.clientName || ''));

          this.filteredClients = [...this.Clients];
        } else {
        }
      },
      error: (err) => {
        console.error('Erro ao carregar clientes', err);
        this.spinner.hide();
      },

      complete: () => {
        this.spinner.hide();
      },
    });
  }

  loadProfessionals(): void {
    this.professionalService.getProfessional().subscribe({
      next: (data) => (this.professionals = data),
      error: (err) => console.error('Erro ao buscar profissional', err),
    });
  }

  loadServices(): void {
    this.spinner.show();
    this.servicoService.getServicos().subscribe({
      next: (data) => {
        console.log(data);
        if (!data || data.length === null) {
          this.toastr.warning('Nenhum serviço cadastrado', 'Aviso');
          this.Servicos = [];
          return;
        }
        if (Array.isArray(data)) {
          this.Servicos = data
            .filter((service) => service.serviceId && service.serviceName)
            .sort((a, b) => a.serviceName.localeCompare(b.serviceName || ''))
            .slice(0, 10);
        } else {
          this.toastr.error('Erro ao carregar clientes!', 'Erro');
        }
      },
      error: (err) => {
        console.error('Erro ao carregar clientes', err);
        this.toastr.error('Erro ao carregar clientes!', 'Erro');
        this.spinner.hide();
      },

      complete: () => {
        this.spinner.hide();
      },
    });
  }

  addClients() {
    const anamneseId = Number(this.selectedAnamnese);
    if (isNaN(anamneseId)) {
      this.toastr.warning('Selecione uma anamnese!', 'Erro');
      return;
    }
    const cliente = {
      clientId: this.ClientId,
      clientName: this.ClientName,
      clientEmail: this.ClientEmail,
      address: this.Address,
      city: this.City,
      state: this.State,
      phoneNumber: this.PhoneNumber,
      facebook: this.Facebook,
      instagram: this.Instagram,
      profession: this.Profession,
      anamneseId: anamneseId,
    };
    console.log('Dados enviados para o backend:', cliente);
    this.spinner.show();
    if (
      !this.ClientName ||
      !this.ClientEmail ||
      !this.Address ||
      !this.City ||
      !this.State ||
      !this.PhoneNumber
    ) {
      this.toastr.warning('Preencha todos os campos!', 'Erro');
      this.spinner.hide();
      return;
    }
    this.clientService.addClients(cliente).subscribe({
      next: () => {
        this.toastr.success('Cliente cadastrado com sucesso!', 'Sucesso');
        this.bsModalRef?.hide();
        this.spinner.hide();
        this.router.navigate(['/public/agendar']);
      },
      error: (error) => {
        console.error('Erro ao cadastrar:', error);
        this.toastr.error('Erro ao cadastrar o cliente!', 'Erro');
        this.spinner.hide();
      },
    });
  }

  generateAvailableTimes() {
    const startHour = 8; // Início às 08:00
    const endHour = 20; // Fim às 20:00

    this.availableTimes = [];

    for (let hour = startHour; hour <= endHour; hour++) {
      // Bloqueia 12:00 e 12:30
      if (hour === 12) continue;

      this.availableTimes.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < endHour) {
        this.availableTimes.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }

    // Ajuste para permitir 11:30 e 13:30
    if (!this.availableTimes.includes('11:30'))
      this.availableTimes.push('11:30');
    if (!this.availableTimes.includes('13:30'))
      this.availableTimes.push('13:30');

    // Ordena para manter sequência cronológica
    this.availableTimes.sort((a, b) => {
      const [ah, am] = a.split(':').map(Number);
      const [bh, bm] = b.split(':').map(Number);
      return ah - bh || am - bm;
    });
  }
  setDateTimeLimits() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Ajusta para dois dígitos
    const day = today.getDate().toString().padStart(2, '0'); // Ajusta para dois dígitos

    this.minDateTime = `${year}-${month}-${day}T08:00`;
    this.maxDateTime = `${year}-${month}-${day}T20:00`;
  }

  checkAvailableTimes(): void {
    if (this.schedule.professional && this.schedule.scheduleDate) {
      const professionalId = Number(this.schedule.professional);
      const date = typeof this.schedule.scheduleDate === 'string'
    ? new Date(this.schedule.scheduleDate)
    : this.schedule.scheduleDate;

      this.scheduleService
        .getHorariosOcupados(professionalId, date)
        .subscribe((ocupados) => {
          // Garante formato HH:mm:ss para comparação
          this.filteredTimes = this.allHours.filter((h) => {
            const fullHour = h + ':00'; // ex: "16:00" => "16:00:00"
            return !ocupados.includes(fullHour);
          });

          console.log('Horários filtrados:', this.filteredTimes);
        });
    }
  }

  onClientSelect(): void {
    const selectedClient = this.Clients.find(
      (client) => client.clientId === +this.schedule.clientId
    );

    if (selectedClient) {
      console.log('Cliente selecionado:', selectedClient);
      this.PhoneNumber = selectedClient.phoneNumber || '';
      this.ClientEmail = selectedClient.clientEmail || '';
    } else {
      this.PhoneNumber = '';
      this.ClientEmail = '';
    }
  }

  LoadAnamneses(): void {
    console.log;
    this.anamneseService.getAnamneses().subscribe({
      next: (data) => {
        console.log('Dados recebidos:', data);
        this.anamneses = data;
        if (!data) {
          this.toastr.warning('Nenhuma Anamnese encontrada', 'Atenção');
        }
      },
      error: (err) => {
        if (err.status === 404) {
          console.error('Erro ao carregar anamneses', err);
          this.toastr.warning('Nenhuma Anamnese cadastrada!', 'Atenção');
        } else {
          console.error('Erro ao carregar anamneses', err);
          this.toastr.error('Erro ao carregar anamneses!', 'Erro');
        }
      },
    });
  }

  onDateChange(): void {
    this.checkAvailableTimes();
  }

  onProfessionalChange(): void {
    this.checkAvailableTimes();
  }

  onServiceChange(): void {
    this.checkAvailableTimes();

    const selectedServiceId = Number(this.schedule.servicoAgendado);

    if (!selectedServiceId) {
      this.filteredProfessionals = [];
      this.schedule.professional = '';
      return;
    }

    // Filtra os profissionais com base no serviço selecionado
    this.filteredProfessionals = this.professionals.filter((prof) => {
      const nomeProfissional = prof.professionalName?.toLowerCase();
      const isAndreia = nomeProfissional === 'andreia koboldt';

      if (isAndreia) {
        // Andreia pode todos os serviços
        return true;
      }

      // Para os demais, bloqueia serviços 7 e 18
      if (selectedServiceId === 7 || selectedServiceId === 18) {
        return false;
      }

      // Se não for serviço 7 ou 18, profissional está liberado
      return true;
    });

    // Se o profissional selecionado não estiver na lista filtrada, limpa a seleção
    if (
      !this.filteredProfessionals.some(
        (p) => p.professionalId === Number(this.schedule.professional)
      )
    ) {
      this.schedule.professional = '';
    }
  }

  addSchedule(): void {
    console.log('ClientId selecionado:', this.schedule.clientId);

    if (
      !this.schedule.clientId ||
      !this.schedule.scheduleDate ||
      !this.scheduleTime ||
      !this.schedule.servicoAgendado ||
      !this.schedule.professional
    ) {
      this.toastr.warning('Todos os campos são obrigatórios!');
      return;
    }

    const selectedClient = this.Clients.find(
      (client) => client.clientId == this.schedule.clientId
    );

    if (!selectedClient) {
      console.error('Erro: Cliente não encontrado!');
      this.toastr.error('Cliente não encontrado!');
      return;
    }

    const date = new Date(this.schedule.scheduleDate); // já é Date vindo do Datepicker
    const [hours, minutes] = this.scheduleTime.split(':').map(Number);
    date.setHours(hours, minutes, 0, 0); // define hora, minuto, segundo, milissegundo
    const fullDateTime = date;

    console.log('Data final formatada:', fullDateTime);

    // Verifica se a data é anterior a hoje
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const selectedDate = new Date(
      fullDateTime.getFullYear(),
      fullDateTime.getMonth(),
      fullDateTime.getDate()
    );

    if (selectedDate < today) {
      this.toastr.warning(
        'Não é possível agendar para dias anteriores a hoje!'
      );
      return;
    }

    // Verifica se a data/hora é anterior ao momento atual
    if (fullDateTime < now) {
      this.toastr.warning(
        'Não é possível agendar para um horário anterior ao atual!'
      );
      return;
    }

    const localDate = new Date(fullDateTime.getTime() - fullDateTime.getTimezoneOffset() * 60000);
    const localISO = localDate.toISOString(); // ISO no horário local (sem adiantar 3h)

    const scheduleData = {
      clientId: this.schedule.clientId,
      clientName: selectedClient.clientName,
      serviceId: this.schedule.servicoAgendado,
      professionalId: this.schedule.professional,
      scheduleDate: localISO,
      clienteName: this.ClienteName,
      servicoAgendado: this.schedule.servicoAgendado,
      professional: this.schedule.professional,
      scheduleDesc: this.scheduleDesc,
      bookingCount: this.schedule.bookingCount,
      phoneNumber: this.schedule.phoneNumber,
      email: this.schedule.email,
    };

    console.log('📤 Agendamento a ser enviado:', scheduleData);

    this.spinner.show();
    this.scheduleService.addSchedule(scheduleData).subscribe({
      next: (response) => {
        console.log('✅ Agendamento criado com sucesso:', response);
        this.toastr.success('Agendamento criado com sucesso!');
        this.bsModalRef?.hide();
        this.spinner.hide();
      },
      error: (err) => {
        if (err.status === 409) {
          this.toastr.warning(
            err.error?.error || 'Conflito de horário: já existe agendamento!'
          );
        } else {
          this.toastr.error('Erro ao criar agendamento!');
        }
        console.error('❌ Erro ao criar agendamento:', err);
        this.spinner.hide();
      },
    });
  }
}
