import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = true;
  constructor(
    private router: Router
  ) { }
  logout() {
    localStorage.clear();
    this.router.navigate(['auth/login']);
  }
  login() {
    this.isLoggedIn = true;
  }
  isAuthenticated() {
    JSON.parse(localStorage.getItem('token')) ? this.isLoggedIn = true : this.isLoggedIn = false;
    return this.isLoggedIn;
  }
}
