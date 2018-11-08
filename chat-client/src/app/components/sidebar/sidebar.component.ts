import { Component, OnInit } from '@angular/core';

import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  public activeUsers: User[];
  public currentUser: User;

  constructor(private userService: UserService,
    private router: Router) { }

  ngOnInit() {
    this.getCurrentUser();
    this.getActiveUsers();
  }

  /**
   * Get the currently logged in user
   */
  getCurrentUser() {
    if (this.userService.currentUser)
      this.currentUser = this.userService.currentUser;
    else {
      this.userService.getUserByUsername(localStorage.getItem('username'))
      .subscribe((user: User) => {
        this.currentUser = user;
      }, (err) => { console.log(err) });
    }
  }

  /**
   * Retrieve the list of currently active users from the database
   */
  getActiveUsers() {
    this.userService.getActiveUsers()
    .subscribe((users: User[]) => {
      this.activeUsers = users;
    })
  }

  /**
  * Retrieve the username
  */
  getUserName() {
    return this.currentUser ? this.currentUser.userName : localStorage.getItem('username');
  }

  logout() {
    this.currentUser.isActive = false;
    this.userService.updateUser(this.currentUser)
    .subscribe((user: User) => {
      console.log(user);
      this.router.navigate(['/']);
    });
  }

}
