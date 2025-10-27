import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Dashboard {
  clientId: number;
  clientName: string;
  bookinCount: number;

}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://localhost:7254/api/Schedule';

constructor(private http: HttpClient) { }

  getTop10ClientsThisMonth(): Observable<Dashboard[]> {
    return this.http.get<Dashboard[]>(`${this.apiUrl}/agendamentos?topClients=true`);
  }
}
