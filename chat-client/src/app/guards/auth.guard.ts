import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
      
      let user: User = JSON.parse(localStorage.getItem('user'));
      
      if (user) {
        return true;
      } else {
        this.router.navigate(['/']);
        return false;
      }
  }
}
