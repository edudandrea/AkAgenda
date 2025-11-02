import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = `${environment.apiUrl}/Users/login`;


constructor(private http: HttpClient) { }

  login(login: string, password: string): Observable<any> {
    const body = { login, password };
    return this.http.post<any>(this.apiUrl, body);
  }

}
