import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'http://localhost:7254/api/Users/login';


constructor(private http: HttpClient) { }

  login(login: string, password: string): Observable<any> {
    const body = { login, password };
    return this.http.post<any>(this.apiUrl, body);
  }

}
