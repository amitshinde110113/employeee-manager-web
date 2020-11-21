import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostLoginGuardService implements CanActivate {


  constructor(private authService: AuthService, private _router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.authService.isAuthenticated()) {
      console.log('this.authService.isAuthenticated()', this.authService.isAuthenticated())
      this._router.navigate(['employee/list']);
      return false;
    }
    console.log('this.authService.isAuthenticated()', this.authService.isAuthenticated())

    // navigate to login page
    return true;
  }
}
