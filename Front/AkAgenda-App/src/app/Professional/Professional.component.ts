import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ProfessionalService } from '../Services/Professional.service';

@Component({
  selector: 'app-Professional',
  templateUrl: './Professional.component.html',
  styleUrls: ['./Professional.component.scss']
})
export class ProfessionalComponent implements OnInit {
  professionals: any = [] = [];
  bsModalRef?: BsModalRef;
  ProfessionalId: number = 0;
  ProfessionalName: string = '';
  Position: string = '';
  PhoneNumber: string = '';
  Email: string = '';
  selectedProfessional: any;
  editedProfs: any;
  selectedFile: File | undefined;
  imagePreviewUrl: any 


  constructor(private professionalService: ProfessionalService,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService,
              private modal: BsModalService) { }

  ngOnInit() {
    this.loadProfessional();
  }

  openModal(template: any){
    this.bsModalRef = this.modal.show(template, {class: 'modal-lg custom-modal',
                                                 ignoreBackdropClick: true,
                                                 backdrop: 'static'});{} 

  }

  loadProfessional(): void {
    this.spinner.show();
    this.professionalService.getProfessional().subscribe({
      next: (data) => {
        console.log(data);
        if (!data || data.length === null) {  
          this.toastr.warning('Nenhum profissional cadastrado', 'Aviso');
          this.professionals = []; 
          return;
      }   
        if(Array.isArray(data)) {
          this.professionals = data
          .filter(prof => prof.professionalId && prof.professionalName)
          .sort((a, b) => a.professionalName.localeCompare(b.professionalName || ''))
          .slice(0, 10);           
     
          this.toastr.success('Profissional carregado com sucesso!', 'Sucesso');
          this.spinner.hide();
          } else {
            this.toastr.error('Erro ao carregar Profissional!', 'Erro');
          }
        },
        error: (err) => {
          if(err.status === 404) {
           console.error('Erro ao carregar profissioanis', err);
           this.toastr.warning('Nenhumo Profissional cadastrado!', 'Atenção');
           this.spinner.hide();
          }else{
            console.error("Erro ao carregar profissioanis", err);
            this.toastr.error("Erro ao carregar profissionais!", "Erro");
            this.spinner.hide();
    
          }
    
         }
    });


}

  onFileChange(event: any): void {
    const file = event.target.files[0]; // Obtendo o primeiro arquivo selecionado
    
    if (file) {
      // Verificar se o arquivo é uma imagem e se o tamanho está dentro do limite
      const maxSize = 5 * 1024 * 1024; // Limite de 5MB (ajuste conforme necessário)
      if (file.size > maxSize) {
        this.toastr.warning('O arquivo selecionado é muito grande. Tente um arquivo com tamanho inferior a 5MB.', 'Erro');
        return;
      }
  
      // Verificar se é uma imagem
      if (!file.type.startsWith('image/')) {
        this.toastr.warning('Por favor, selecione um arquivo de imagem.', 'Erro');
        return;
      }
  
      // Atribuindo o arquivo à variável selectedFile
      this.selectedFile = file; 
  
      // Criar uma URL de visualização para exibir a miniatura da imagem
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageUrl = e.target.result;
        this.imagePreviewUrl = imageUrl;  // Aqui você pode armazenar a URL da imagem para mostrar a miniatura
      };
      reader.readAsDataURL(file);
  
      console.log("Arquivo selecionado:", this.selectedFile);
    }
  }

  openModalEdit(templateEdit: any, profId: number) {    
    console.log('Componente atual:', templateEdit);
    console.log('Profissional ID recebido:', profId);           
    
    this.professionalService.getProfessionalById(profId).subscribe({
      next: (data) => {
        if(data) {
          this.selectedProfessional = data;
          this.editedProfs = {... data};
          console.log('Profissional carregado:', this.selectedProfessional); 
          this.toastr.success('Profissional carregado com sucesso!', 'Sucesso');

          this.ProfessionalId = profId;
          this.bsModalRef = this.modal.show(templateEdit, {class: 'modal-lg custom-modal',
                                                           ignoreBackdropClick: true,
                                                           backdrop: 'static'})
           
        }
        else{
          this.toastr.warning('Profissional não encontrado!', 'Aviso');
        }
      },
      error: (err) => {
        console.error('Erro ao carregar Profissional', err);
        this.toastr.error('Erro ao carregar Profissional!', 'Erro');
      }
    });
    
  }


  addProfessional() {
    // Verificando se todos os campos obrigatórios estão preenchidos
    if (!this.ProfessionalName || !this.Position || !this.PhoneNumber) {
        this.toastr.warning('Preencha todos os campos!', 'Erro');
        return;
    }
    
    // Criando objeto com os dados do profissional
    const professionalData = {
        professionalId: this.ProfessionalId,
        professionalName: this.ProfessionalName,
        position: this.Position,
        phoneNumber: this.PhoneNumber,
        email: this.Email,       
        photoPath: ''
        
    };
    
    // Exibir spinner durante a requisição
    this.spinner.show();
    
    // Chamando o serviço para enviar os dados
    this.professionalService.addProfessional(professionalData, this.selectedFile).subscribe({
        next: () => {
            this.toastr.success('Profissional cadastrado com sucesso!', 'Sucesso');
            this.bsModalRef?.hide();
            this.loadProfessional();
        },
        error: (error) => {
            console.error("Erro ao cadastrar:", error);
            this.toastr.error('Erro ao cadastrar o Profissional!', 'Erro');
            this.spinner.hide();
        },
        complete: () => {
            this.spinner.hide();
        }
    });
  }

  editProfessional() {
    // Monta o objeto com os dados atualizados do formulário
    const professionalData: any = {
      professionalId: this.ProfessionalId,
      professionalName: this.editedProfs.professionalName,
      position: this.editedProfs.position,
      phoneNumber: this.editedProfs.phoneNumber,
      email: this.editedProfs.email
    };
  
    // Exibe no console os dados que serão enviados
    console.log('Dados enviados para API:');
    console.log('professionalId:', professionalData.professionalId);
    console.log('professionalName:', professionalData.professionalName);
    console.log('position:', professionalData.position);
    console.log('phoneNumber:', professionalData.phoneNumber);
    console.log('email:', professionalData.email);
  
    this.spinner.show();
  
    this.professionalService.editProfessional(professionalData, this.selectedFile).subscribe({
      next: () => {
        this.toastr.success('Profissional editado com sucesso!', 'Sucesso');
        this.bsModalRef?.hide();  
        this.loadProfessional();   
      },
      error: (error) => {
        console.error("Erro ao editar:", error);
        this.toastr.error('Erro ao editar o Profissional!', 'Erro');
        this.spinner.hide(); 
      },
      complete: () => {
        this.spinner.hide(); 
      }
    });
  }

  
  deleteProfessionals(professionalId: number): void {
    if(confirm('Deseja realmente excluir este Profissional?')) {
      this.spinner.show();
      this.professionalService.deleteProfessional(professionalId).subscribe({
        next: () => {
          console.log(professionalId);
          this.toastr.success('Profissional excluído com sucesso!', 'Sucesso');
          this.loadProfessional();
        },
        error: (err) => {
          console.error('Erro ao excluir Profissional', err);
          this.toastr.error('Erro ao excluir Profissional!', 'Erro');
          this.spinner.hide();
        }
      });
    }
  } 
}
