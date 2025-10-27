import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AnamnesesService } from '../Services/Anamneses.service';

@Component({
  selector: 'app-Anamneses',
  templateUrl: './Anamneses.component.html',
  styleUrls: ['./Anamneses.component.scss']
})
export class AnamnesesComponent implements OnInit {
  bsModalRef?: BsModalRef;
  anamneses: any[] = [];
  anamneseId: number = 0;
  anamneseName: string = '';
  anamneseDesc: string = '';
  selectedAnamnese: any = [];
  editedAnamnese: any = [];


  constructor(private anamneseService: AnamnesesService,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService,
              private modal: BsModalService) { }

  ngOnInit() {
    this.LoadAnamneses();
  }

  openModal(template: any) {
    this.bsModalRef = this.modal.show(template, {class: 'modal-lg custom-modal',
                                                     ignoreBackdropClick: true,
                                                     backdrop: 'static'});{}      
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

  addAnamneses() {  
      const anamnese ={
        anamneseId: this.anamneseId,
        anamneseName: this.anamneseName,
        anamneseDesc: this.anamneseDesc,      
      };  
      console.log("Dados enviados para o backend:", anamnese);
      this.spinner.show();
      if(!this.anamneseName || !this.anamneseDesc) {
        this.toastr.warning('Preencha todos os campos!', 'Erro');
        this.spinner.hide();
        return;
      }
      this.anamneseService.addAnamnese(anamnese).subscribe({
        next: () => {
          this.toastr.success('Anamnese cadastrada com sucesso!', 'Sucesso');
          this.bsModalRef?.hide();
          this.spinner.hide();
          this.LoadAnamneses();
        },
        error: (error) => {
          console.error("Erro ao cadastrar:", error);
          this.toastr.error('Erro ao cadastrar a Anamnese!', 'Erro');
          this.spinner.hide();
        }
      });
  }

  editAnamnese(): void {
    if(!this.selectedAnamnese) {
      this.toastr.warning('Selecione uma anamnese para editar!', 'Erro');
      return;
    }
      const updateAnamnese = { ...this.selectedAnamnese, ...this.editedAnamnese };
      Object.keys(this.selectedAnamnese).forEach(key => {
        if(this.selectedAnamnese[key] !== this.editedAnamnese[key] && this.editedAnamnese[key] !== undefined) { 
          updateAnamnese[key] = this.editedAnamnese[key];
        }
      });
      if(Object.keys(updateAnamnese).length === 0) {
        this.toastr.warning('Nenhum campo foi alterado!', 'Erro');
        return;
      }
      updateAnamnese.anamneseId = this.selectedAnamnese.anamneseId;
      
      console.log('Dados a serem enviados para edição:', updateAnamnese);
      this.anamneseService.editAnamneses(updateAnamnese).subscribe({
        next: () => {
          this.toastr.success('Cliente editado com sucesso!', 'Sucesso');
          this.bsModalRef?.hide();
          this.spinner.hide();
          this.LoadAnamneses();
        },
        error: (err) => {
          console.error('Erro ao editar cliente', err);
          this.toastr.error('Erro ao editar cliente!', 'Erro');
        }
    });
  }

  deleteAnamneses(AnamneseId: number): void {
    if(confirm('Deseja realmente excluir essa Anamnese?')) {
      this.spinner.show();
      this.anamneseService.deleteAnamnese(AnamneseId).subscribe({
        next: () => {
          console.log(AnamneseId);
          this.toastr.success('Anamnese excluída com sucesso!', 'Sucesso');
          this.spinner.hide();
          this.LoadAnamneses();
          
        },
        error: (err) => {
          console.error('Erro ao excluir Anamnese', err);
          this.toastr.error('Erro ao excluir Anamnese!', 'Erro');
          this.spinner.hide();
        }
      });
    }
  }    

  openModalEdit(templateEdit: any, AnamneseId: number) {    
    console.log('Cliente ID recebido:', AnamneseId); 
          
    this.anamneseId = AnamneseId;

    this.bsModalRef = this.modal.show(templateEdit, {class: 'modal-lg custom-modal',
                                                     ignoreBackdropClick: true,
                                                     backdrop: 'static'});{}
    this.anamneseService.getAnamneseById(AnamneseId).subscribe({
      next: (data) => {
        if(data) {
          this.selectedAnamnese = data;
          this.editedAnamnese = {... data};
          console.log('Cliente carregado:', this.selectedAnamnese); 
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

}
