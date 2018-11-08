import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiBase: string = 'api/users';
  public currentUser: User;

  constructor(private http: HttpClient,
    private router: Router) { }

  /**
   * Given a username and a password, requests the user's account 
   * from the server in an attempt to log in to the user's account
   * @param username The username for the account being requested
   * @param password The unhashed password for the account being requested
   */
  login(username: string, password: string) {
    const login = { username, password };
    const endpoint = `${environment.serverBase}${this.apiBase}/login`;

    // Make call to server
    this.http.post(endpoint, login)
    .subscribe((user: User) => {
      this.currentUser = user;
      localStorage.setItem('username', this.currentUser.userName);
      this.router.navigate(['/lobby']);
    }, (err) => { console.log(err) });
  }

  /**
   * Sends a request to the sever to create a new user
   * @param username The username for the new user
   * @param password The password for the new user
   * @returns An Observable containing the newly created user
   */
  createAccount(username: string, password: string) {
    const endpoint = `${environment.serverBase}${this.apiBase}`;
    let newUser = {
      username: username,
      password: password
    };

    this.http.post<User>(endpoint, newUser)
    .subscribe((user: User) => {
      this.currentUser = user;
      this.router.navigate(['/lobby']);
    }, (err) => {
      console.log(err);
    });
  }

  /**
   * Retrieves a user by their username
   * @param username The username for the user we want to fetch
   */
  getUserByUsername(username: string) {
    const endpoint = `${environment.serverBase}${this.apiBase}/${username}`;
    return this.http.get<User>(endpoint);
  }

  /**
   * Returns an observable containing users who are currently active
   * on the site
   */
  getActiveUsers(): Observable<User[]> {
    const endpoint = `${environment.serverBase}${this.apiBase}/active`;
    return this.http.get<User[]>(endpoint);
  }

  /**
   * Updates a user's information in the database
   * @param user The user to update in the database
   * @returns Observable containing the user we updated
   */
  updateUser(user: User): Observable<User> {
    const endpoint = `${environment.serverBase}${this.apiBase}/update`;
    return this.http.post<User>(endpoint, user);
  }

}
