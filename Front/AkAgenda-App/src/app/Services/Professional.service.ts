import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Professionals{
  professionalId: number
  professionalName: string
  position: string
  phoneNumber: string
  email: string
  photoPath: string

}

@Injectable({
  providedIn: 'root'
})
export class ProfessionalService {
  private apiUrl = 'http://localhost:7254/api/professional';

constructor(private http: HttpClient) { }

  getProfessional(): Observable<any[]> {
    return this.http.get<Professionals[]>(this.apiUrl);
  }

  getProfessionalById(ProfessionalId: number): Observable<Professionals> {
        console.log('Dados enviados para API:', ProfessionalId); 
        return this.http.get<Professionals>(`${this.apiUrl}/${ProfessionalId}`);    
  }

  addProfessional(professional: Professionals, selectedFile?: File): Observable<Professionals> {
    const token = localStorage.getItem('token'); 
    console.log('Token usado para autenticação:', token);// ou sessionStorage, dependendo de onde você guarda
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const formData = new FormData();

    formData.append('professionalId', professional.professionalId.toString());
    formData.append('professionalName', professional.professionalName);
    formData.append('position', professional.position);
    formData.append('phoneNumber', professional.phoneNumber);
    formData.append('email', professional.email);

    if (selectedFile) {
        formData.append('photo', selectedFile, selectedFile.name);
    }

        return this.http.post<Professionals>(this.apiUrl, formData, { headers });
  }

    editProfessional(professional: any, selectedFile?: File): Observable<Professionals> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    
      const formData = new FormData();
      formData.append('professionalId', professional.professionalId);
    
      if (professional.professionalName) {
        formData.append('professionalName', professional.professionalName);
      }
      if (professional.position) {
        formData.append('position', professional.position);
      }
      if (professional.phoneNumber) {
        formData.append('phoneNumber', professional.phoneNumber);
      }
      if (professional.email) {
        formData.append('email', professional.email);
      }
      if (selectedFile) {
        formData.append('photo', selectedFile, selectedFile.name);
      }
    
      return this.http.put<Professionals>(
        `${this.apiUrl}/${professional.professionalId}`,
        formData,
        { headers }
      );
    }

    deleteProfessional(professionalId: number): Observable<Professionals> {
      const token = localStorage.getItem('token'); 
      console.log('Token usado para autenticação:', token);// ou sessionStorage, dependendo de onde você guarda
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
          return this.http.delete<Professionals>(`${this.apiUrl}/${professionalId}`, { headers });
  }

}
