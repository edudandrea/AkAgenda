import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Clients {
  clientId: number;
  clientName: string;
  clientEmail: string;
  phoneNumber: string;
  address: string;
  city: string; 
  state: string;
  facebook: string;
  instagram: string;
  profession: string;
  anamneseId: number
}

@Injectable({
  providedIn: 'root'
})
  export class ClientService {

    private apiUrl = 'http://localhost:7254/api/Clients';

  constructor(private http: HttpClient) { }

  getClients(): Observable<any[]> {
    return this.http.get<Clients[]>(this.apiUrl);

  }
  getClientsById(ClienteId: number): Observable<Clients> {
    console.log('Dados enviados para API:', ClienteId); 
    return this.http.get<Clients>(`${this.apiUrl}/${ClienteId}`);

  }

  addClients(cliente: Clients): Observable<Clients> {
    return this.http.post<Clients>(this.apiUrl, cliente)
  };

  deleteClients(clientId: number): Observable<Clients> {
   const token = localStorage.getItem('token');           
    const headers = new HttpHeaders({
     'Authorization': `Bearer ${token}`});
    return this.http.delete<Clients>(`${this.apiUrl}/${clientId}`, { headers });
  }

  editClients(client: Partial<Clients>): Observable<Clients> {    
    return this.http.put<Clients>(`${this.apiUrl}/${client.clientId}`, client)
  }

 
  
}
