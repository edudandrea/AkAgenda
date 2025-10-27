import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClientService } from '../Services/Client.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AnamnesesService } from '../Services/Anamneses.service';



@Component({
  selector: 'app-CadastroClientes',
  templateUrl: './CadastroClientes.component.html',
  styleUrls: ['./CadastroClientes.component.scss']
})
export class CadastroClientesComponent implements OnInit {
  bsModalRef?: BsModalRef
  searchTerm: string = '';
  Clients: any[] = [];
  ClientId: number = 0;
  ClientName: string = '';
  ClientEmail: string = '';
  Address: string = '';
  City: string = '';
  State: string = '';
  PhoneNumber: string = '';
  Facebook: string = '';
  Instagram: string = '';
  Profession: string = '';
  anamneseId: number = 0
  anamneses: any[] = [];
  selectedAnamnese: any;
  AnamneseName: string = '';
  selectedClient: any = [];
  editedClient: any = [];
  filteredClients: any [] = [];
  currentPage: number = 1;
  clientsPerPage: number = 10;
  totalPages: number = 1;



  constructor( private clientService: ClientService,
               private anamneseService: AnamnesesService, 
               private spinner: NgxSpinnerService,
               private toastr: ToastrService,
               private modal: BsModalService
  ) { }

  ngOnInit() {
    this.loadClients();
    this.LoadAnamneses();    
  }

  searchClients(): void{
    if(this.searchTerm){
      this.filteredClients = this.Clients.filter(client => 
        client.clientName.toLowerCase().includes(this.searchTerm.toLowerCase()));
    } else {
      this.filteredClients = [...this.Clients];
    }
  }

    openModal(template: any) {
      this.bsModalRef = this.modal.show(template, {class: 'modal-lg custom-modal',
                                                     ignoreBackdropClick: true,
                                                     backdrop: 'static'});{}      
    }

    get paginatedClients(): any[] {
      const startIndex = (this.currentPage - 1) * 9;
      const endIndex = startIndex + 9;
      return this.filteredClients.slice(startIndex, endIndex);
    }


    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        console.log("Página alterada para:", this.currentPage);
      }
    }


    openModalEdit(templateEdit: any, clienteId: number) {    
      console.log('Cliente ID recebido:', clienteId); 
            
      this.ClientId = clienteId;

      this.bsModalRef = this.modal.show(templateEdit, {class: 'modal-lg custom-modal',
                                                       ignoreBackdropClick: true,
                                                       backdrop: 'static'});{}
      this.clientService.getClientsById(clienteId).subscribe({
        next: (data) => {
          if(data) {
            this.selectedClient = data;
            this.editedClient = {... data, anamneseId: data.anamneseId ?? null};
            console.log('Cliente carregado:', this.selectedClient); 
            this.toastr.success('Cliente carregado com sucesso!', 'Sucesso');
             
          }
          else{
            this.toastr.warning('Cliente não encontrado!', 'Aviso');
          }
        },
        error: (err) => {
          console.error('Erro ao carregar cliente', err);
          this.toastr.error('Erro ao carregar cliente!', 'Erro');
        }
      });
      
    }
    
    addClients() {
      const anamneseId = Number(this.selectedAnamnese);
      if(isNaN(anamneseId)) {
        this.toastr.warning('Selecione uma anamnese!', 'Erro');
        return;
      }
        const clienteExistente = this.Clients.some(client => client.clientName.toLowerCase() === this.ClientName.toLowerCase());
      if (clienteExistente) {
          this.toastr.warning('Já existe um cliente com esse nome!', 'Erro');
          return;
      }


        const cliente ={
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
          anamneseId: anamneseId
        };  
        console.log("Dados enviados para o backend:", cliente);
        this.spinner.show();
        if(!this.ClientName || !this.ClientEmail || !this.Address || !this.City || !this.State || !this.PhoneNumber) {
          this.toastr.warning('Preencha todos os campos!', 'Erro');
          this.spinner.hide();
          return;
        }
       
        this.clientService.addClients(cliente).subscribe({
          next: () => {
            this.toastr.success('Cliente cadastrado com sucesso!', 'Sucesso');
            this.bsModalRef?.hide();
            this.spinner.hide();
            this.loadClients();
          },
          error: (error) => {
             if(this.PhoneNumber.length <11){
              this.toastr.warning('O telefone deve ter 11 nuúmeros!', 'Erro');
            }
            console.error("Erro ao cadastrar:", error);
            this.toastr.error('Erro ao cadastrar o cliente!', 'Erro');
            this.spinner.hide();
          }
        });
    }

    LoadAnamneses(): void{      
      console.log
      this.anamneseService.getAnamneses().subscribe({
       next: (data) => {
         console.log("Dados recebidos:", data);
         this.anamneses = data;
         if(!data){
          this.toastr.warning('Nenhuma Anamnese encontrada', 'Atenção')
         }
       },
       error: (err) => {
        if(err.status === 404) {
         console.error('Erro ao carregar anamneses', err);
         this.toastr.warning('Nenhuma Anamnese cadastrada!', 'Atenção');
        }else{
          console.error("Erro ao carregar anamneses", err);
          this.toastr.error("Erro ao carregar anamneses!", "Erro");
  
        }
  
       }
     });
   }

    editClients(): void {
      if(!this.selectedClient) {
        this.toastr.warning('Selecione um cliente para editar!', 'Erro');
        return;
      }
        const updateClient = { ...this.selectedClient, ...this.editedClient };
        Object.keys(this.selectedClient).forEach(key => {
          if(this.selectedClient[key] !== this.editedClient[key] && this.editedClient[key] !== undefined) { 
            updateClient[key] = this.editedClient[key];
          }
        });
        if(Object.keys(updateClient).length === 0) {
          this.toastr.warning('Nenhum campo foi alterado!', 'Erro');
          return;
        }

        if (this.editedClient.anamneseId !== undefined) {
          updateClient.anamneseId = this.editedClient.anamneseId;
      } else {
          updateClient.anamneseId = this.selectedClient.anamneseId; // Mantém o valor original
      }
        updateClient.clientId = this.selectedClient.clientId;
        
        console.log('Dados a serem enviados para edição:', updateClient);
        this.clientService.editClients(updateClient).subscribe({
          next: () => {
            this.toastr.success('Cliente editado com sucesso!', 'Sucesso');
            this.bsModalRef?.hide();
            this.spinner.hide();
            this.loadClients();
          },
          error: (err) => {
            console.error('Erro ao editar cliente', err);
            this.toastr.error('Erro ao editar cliente!', 'Erro');
          }
      });
    }

    deleteClients(ClientId: number): void {
      if(confirm('Deseja realmente excluir este cliente?')) {
        this.spinner.show();
        this.clientService.deleteClients(ClientId).subscribe({
          next: () => {
            console.log(ClientId);
            this.toastr.success('Cliente excluído com sucesso!', 'Sucesso');
            this.loadClients();
          },
          error: (err) => {
            console.error('Erro ao excluir cliente', err);
            this.toastr.error('Erro ao excluir cliente!', 'Erro');
            this.spinner.hide();
          }
        });
      }
    }    


    loadClients(): void {
        this.spinner.show();
        this.clientService.getClients().subscribe({
          next: (data) => {
            console.log(data);
            if (!data || data.length === null) {  
              this.toastr.warning('Nenhum cliente cadastrado', 'Aviso');
              this.Clients = []; 
              this.filteredClients = [];
              return;
          }   
            if(Array.isArray(data)) {
              this.Clients = data
              .filter(client => client.clientId && client.clientName)
              .sort((a, b) => a.clientName.localeCompare(b.clientName || ''))              
                            
              this.filteredClients = [...this.Clients];    
              this.updateTotalPages()     
              this.toastr.success('Clientes carregados com sucesso!', 'Sucesso');
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
              }
    });    
  }

  updateTotalPages() {
    this.totalPages = Math.ceil(this.Clients.length / this.clientsPerPage);
    console.log("Total de páginas atualizado:", this.totalPages);
  }

}
