import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

export interface Schedules{
  scheduleId?: number;
  clientId: number,
  clientName: string;
  phoneNumber: string;
  email: string;
  servicoAgendado: string;
  professional: string;
  scheduleDate: Date | string;
  scheduleDesc: string;
  bookingCount: number;
  attended?: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class SchedulesService {

  private apiUrl = `${environment.apiUrl}/Schedule`;

constructor(private http: HttpClient) { }

  getSchedule(): Observable<any[]> {
    return this.http.get<Schedules[]>(this.apiUrl);

  }

  getScheduleById(ScheduleId: number): Observable<Schedules> {
      console.log('Dados enviados para API:', ScheduleId); 
      return this.http.get<Schedules>(`${this.apiUrl}/${ScheduleId}`);
  
  }

  addSchedule(schedule: Schedules): Observable<Schedules>{
    return this.http.post<Schedules>(this.apiUrl, schedule);
  }

  deleteSchedules(scheduleId: number): Observable<Schedules> {
          const token = localStorage.getItem('token');           
          const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
          });
        return this.http.delete<Schedules>(`${this.apiUrl}/${scheduleId}`, { headers });
  }

  editSchedules(schedule: Partial<Schedules>): Observable<Schedules> {
    const token = localStorage.getItem('token');           
          const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
          });
        return this.http.put<Schedules>(`${this.apiUrl}/${schedule.scheduleId}`, schedule, { headers });
  }

  updateAttendance(scheduleId: number, attended: boolean): Observable<void> {
    const token = localStorage.getItem('token');           
    const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`});
    return this.http.put<void>(`${this.apiUrl}/${scheduleId}`, { attended: attended }, { headers });
  }  

  getSchedulesByProfessional(professionalId: number): Observable<any[]> {
    const url = `${this.apiUrl}/professional/${professionalId}`;
    return this.http.get<any[]>(url);
  }

  getSchedulesByDateAndProfessional(date: string, professionalId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/schedules/by-date-professional?date=${date}&professionalId=${professionalId}`);
  }

  getHorariosOcupados(professionalId: number, date: Date): Observable<string[]> {
    const dateStr = date.toISOString(); // Envia como UTC
    return this.http.get<string[]>(`/agendamentos/ocupados`, {
      params: {
        profissionalId: professionalId,
        data: dateStr
      }
    });
  }

}
