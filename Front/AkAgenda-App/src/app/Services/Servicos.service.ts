import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Servicos{
  serviceId?: number;
  serviceName: string;
  serviceDesc: string;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class ServicosService {

  private servicePrices = new Map<number, number>();

  private apiUrl = 'http://localhost:7254/api/Services';

constructor(private http: HttpClient) { }

  getServicos(): Observable<any[]> {
    return this.http.get<Servicos[]>(this.apiUrl);

  }

  setServicePrice(serviceId: number, price: number): void {
    this.servicePrices.set(serviceId, price);
  }

  getServicePrice(serviceId: number): number {
    return this.servicePrices.get(serviceId) || 0;
  }

  getServicesById(ServicoId: number): Observable<Servicos> {
      console.log('Dados enviados para API:', ServicoId); 
      return this.http.get<Servicos>(`${this.apiUrl}/${ServicoId}`);
  
    }

  addServicos(servicos: Servicos): Observable<Servicos> {
      return this.http.post<Servicos>(this.apiUrl, servicos)
  }

  editServices(service: Partial<Servicos>): Observable<Servicos> {
      console.log('URL da API:', `${this.apiUrl}/${service.serviceId}`);
      console.log('Dados enviados para API:', service); 
      return this.http.put<Servicos>(`${this.apiUrl}/${service.serviceId}`, service)
    }

  deleteServices(serviceId: number): Observable<Servicos> {
      return this.http.delete<Servicos>(`${this.apiUrl}/${serviceId}`)
    }

}
