import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

export interface Users {
  login: string;
  userId: number;
  userName: string;
  password: string;
  function: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUrl = `${environment.apiUrl}/Users`;
  

constructor(private http: HttpClient) { }

  addUsers(users: Users): Observable<Users> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.post<Users>(this.apiUrl, users, { headers });
  }

  getUsers(): Observable<Users[]> {
    return this.http.get<Users[]>(this.apiUrl);
  }  

  getUserById(userId: number): Observable<Users> {
    return this.http.get<Users>(`${this.apiUrl}/${userId}`); // Passando userId para a URL
  }

  getUsersByuserName(userName: string): Observable<Users> {
    const params = new HttpParams().set('userName', userName);  // Corrigido para 'username'
    return this.http.get<Users>(`${this.apiUrl}/username`, { params });
  }

  editUsers(userId: number, user: Partial<Users>): Observable<{users: Users, token: string}> {
    console.log('URL da API:', `${this.apiUrl}/${userId}`); // Passando userId na URL
    console.log('Dados enviados para API:', user);
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.put<{users: Users, token: string}>(`${this.apiUrl}/${userId}`, user, { headers }); // Envia userId na URL
  }

  deleteUsers(userId: number): Observable<Users> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      return this.http.delete<Users>(`${this.apiUrl}/${userId}`, { headers });
    }

}
