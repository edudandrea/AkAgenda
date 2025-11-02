import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

export interface Dashboard {
  clientId: number;
  clientName: string;
  bookinCount: number;

}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = `${environment.apiUrl}/Schedule`;

constructor(private http: HttpClient) { }

  getTop10ClientsThisMonth(): Observable<Dashboard[]> {
    return this.http.get<Dashboard[]>(`${this.apiUrl}/agendamentos?topClients=true`);
  }
}
