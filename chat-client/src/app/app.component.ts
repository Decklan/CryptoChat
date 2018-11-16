import { UserService } from './services/user.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { User } from './models/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CryptoChat';
  public currentUser: User;

  constructor(private userService: UserService,
    private router: Router) {
      this.getCurrentUser();
    }

  /**
   * Get the currently logged in user
   */
  getCurrentUser() {
    if (localStorage.getItem('username')) {
      this.userService.getUserByUsername(localStorage.getItem('username'))
      .subscribe((user: User) => {
        this.currentUser = user;
      }, (err) => { console.log(err) });
    }
  }

  /**
   * Retrieve the username
   */
  getUserName() {
    return this.currentUser ? this.currentUser.userName : localStorage.getItem('username');
  }

  /**
   * Log the current user out of the application
   */
  logout() {
    this.currentUser.isActive = false;
    this.userService.updateUser(this.currentUser)
    .subscribe((user: User) => {
      localStorage.removeItem('username');
      // Also remove token
      this.router.navigate(['/']);
    });
  }
}
