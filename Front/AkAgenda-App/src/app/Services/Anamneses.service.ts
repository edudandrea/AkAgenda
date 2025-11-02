import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


export interface Anamneses {
  anamneseId: number;
  anamneseName: string;
  anamneseDesc: string;

}

@Injectable({
  providedIn: 'root'
})
export class AnamnesesService {

  private apiUrl = `${environment.apiUrl}/Anamneses`;


constructor(private http: HttpClient) { }


  getAnamneses(): Observable<any[]> {
      return this.http.get<Anamneses[]>(this.apiUrl);
    }
  getAnamneseById(anamneseId: number): Observable<Anamneses> {
      console.log('Dados enviados para API:', anamneseId); 
      return this.http.get<Anamneses>(`${this.apiUrl}/${anamneseId}`);

    }

  editAnamneses(anamnese: Partial<Anamneses>): Observable<Anamneses> {
    const token = localStorage.getItem('token');           
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
      return this.http.put<Anamneses>(`${this.apiUrl}/${anamnese.anamneseId}`, anamnese , { headers });
    }

   deleteAnamnese(anamneseId: number): Observable<Anamneses> {
    const token = localStorage.getItem('token');           
      const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`});
       return this.http.delete<Anamneses>(`${this.apiUrl}/${anamneseId}`, { headers });
    }

    addAnamnese(anamnese: Anamneses): Observable<Anamneses> {
        return this.http.post<Anamneses>(this.apiUrl, anamnese)
    };

}
