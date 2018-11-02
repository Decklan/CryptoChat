import { Component, OnInit } from '@angular/core';

import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  public activeUsers: User[];
  public currentUser: User;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getCurrentUser();
    this.getActiveUsers();
  }

  getCurrentUser() {
    this.currentUser = this.userService.getCurrentUser();
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

}
