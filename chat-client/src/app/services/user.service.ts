import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiBase: string = 'api/users';

  constructor(private http: HttpClient,
    private router: Router) { }

  /**
   * Given a username and a password, requests the user's account 
   * from the server in an attempt to log in to the user's account
   * @param username The username for the account being requested
   * @param password The unhashed password for the account being requested
   */
  login(username: string, password: string) {
    console.log(username, password);
    const login = { username, password };

    // Make call to server
  }

  createAccount(username: string, password: string) {
    console.log(username, password);
  }

}
