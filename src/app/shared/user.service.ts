import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = 'http://localhost:4000/api/users';

  constructor(private http: HttpClient) { }
  signUp(user: any) {
    return this.http.post(`${this.baseUrl}/signup`, user);
  }
  login(user: any) {
    return this.http.post(`${this.baseUrl}/login`, user);
  }
}
