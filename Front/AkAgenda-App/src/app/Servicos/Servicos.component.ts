import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ServicosService } from '../Services/Servicos.service';

@Component({
  selector: 'app-Servicos',
  templateUrl: './Servicos.component.html',
  styleUrls: ['./Servicos.component.scss']
})
export class ServicosComponent implements OnInit {
  bsModalRef?: BsModalRef
  Servicos: any  [] = []
  ServiceId: number = 0
  ServiceName: string = ''
  ServiceDesc: string = ''
  ServiceTime: number = 0
  ServicePrice: number = 0
  editedService: any = [];
  selectedService: any = [];
  

  constructor(private servicoService: ServicosService,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService,
              private modal: BsModalService
  ) { }

  ngOnInit() {
    this.loadServices()
  }

  openModalNew(template: any) {
    this.bsModalRef = this.modal.show(template, {class: 'modal-lg custom-modal',
                                                     ignoreBackdropClick: true,
                                                     backdrop: 'static'});{}      
  }

  openModalEdit(templateEdit: any, serviceId: number) {    
    console.log('Componente atual:', templateEdit);
    console.log('Servico ID recebido:', serviceId);           
    this.ServiceId = serviceId;
    this.bsModalRef = this.modal.show(templateEdit, {class: 'modal-lg custom-modal',
                                                     ignoreBackdropClick: true,
                                                     backdrop: 'static'})
    this.servicoService.getServicesById(serviceId).subscribe({
      next: (data) => {
        if(data) {
          this.selectedService = data;
          this.editedService = {... data};
          console.log('Serviço carregado:', this.selectedService); 
          this.toastr.success('Serviço carregado com sucesso!', 'Sucesso');
           
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
          // Armazena a lista no componente
          this.Servicos = data
            .filter(service => service.serviceId && service.serviceName)
            .sort((a, b) => a.serviceName.localeCompare(b.serviceName || ''))
               
  
          // Registra os preços no serviço compartilhado
          this.Servicos.forEach(servico => {
            if (servico.serviceId && servico.price != null) {
              this.servicoService.setServicePrice(servico.serviceId, servico.price);
            }
          });
  
          this.toastr.success('Serviços carregados com sucesso!', 'Sucesso');
        } else {
          this.toastr.error('Erro ao carregar serviços!', 'Erro');
        }
      },
      error: (err) => {
        console.error('Erro ao carregar serviços', err);
        this.toastr.error('Erro ao carregar serviços!', 'Erro');
        this.spinner.hide();                
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  addServices() {   
      const servicos ={
        serviceName: this.ServiceName,
        serviceDesc: this.ServiceDesc,
        serviceTime: this.ServiceTime,
        price: this.ServicePrice,        
      };  
      console.log("Dados enviados para o backend:", servicos);
      this.spinner.show();
      if(!this.ServiceName || !this.ServiceDesc || !this.ServicePrice || !this.ServiceTime) {
        this.toastr.warning('Preencha todos os campos!', 'Erro');
        this.spinner.hide();
        return;
      }
      this.servicoService.addServicos(servicos).subscribe({
        next: () => {
          this.toastr.success('Cliente cadastrado com sucesso!', 'Sucesso');
          this.bsModalRef?.hide();
          this.spinner.hide();
          this.loadServices();
        },
        error: (error) => {
          console.error("Erro ao cadastrar:", error);
          this.toastr.error('Erro ao cadastrar o cliente!', 'Erro');
          this.spinner.hide();
        }
      });
  }

  editServices(): void {
    if(!this.selectedService) {
      this.toastr.warning('Selecione um cliente para editar!', 'Erro');
      return;
    }
      const updateService = { ...this.selectedService, ...this.editedService };
      Object.keys(this.selectedService).forEach(key => {
        if(this.selectedService[key] !== this.editedService[key] && this.editedService[key] !== undefined) { 
          this.editedService[key] = this.editedService[key];
        }
      });
      if(Object.keys(updateService).length === 0) {
        this.toastr.warning('Nenhum campo foi alterado!', 'Erro');
        return;
      }
      updateService.serviceId = this.selectedService.serviceId;
      
      console.log('Dados a serem enviados para edição:', updateService);
      this.servicoService.editServices(updateService).subscribe({
        next: () => {
          this.toastr.success('Serviço editado com sucesso!', 'Sucesso');
          this.bsModalRef?.hide();
          this.spinner.hide();
          this.loadServices();
        },
        error: (err) => {
          console.error('Erro ao editar Serviço', err);
          this.toastr.error('Erro ao editar Serviço!', 'Erro');
        }
    });
  }

  deleteServices(ServiceId: number): void {
    if(confirm('Deseja realmente excluir este Serviço?')) {
      this.spinner.show();
      this.servicoService.deleteServices(ServiceId).subscribe({
        next: () => {
          console.log(ServiceId);
          this.toastr.success('Serviço excluído com sucesso!', 'Sucesso');
          this.loadServices();
        },
        error: (err) => {
          console.error('Erro ao excluir Serviço', err);
          this.toastr.error('Erro ao excluir Serviço!', 'Erro');
          this.spinner.hide();
        }
      });
    }
  } 

}
