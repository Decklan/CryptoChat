import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';

import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiBase: string = 'api/users';
  public currentUser: User;

  private usersSubject: BehaviorSubject<User[]>;
  private usersObservable: Observable<User[]>;

  constructor(private http: HttpClient,
    private router: Router) { 
      this.usersSubject = new BehaviorSubject([]);
      this.usersObservable = this.usersSubject.asObservable();

      this.usersObservable = this.fetchActiveUsers();
  }

  /**
   * Fetch the currently active users from the database
   */
  fetchActiveUsers(): Observable<User[]> {
    const endpoint: string = `${environment.serverBase}${this.apiBase}/active`;
    return this.http.get<User[]>(endpoint);
  }

  /**
   * Return the usersObservable to the caller
   */
  getActiveUsers(): Observable<User[]> {
    return this.usersObservable;
  }

  /**
   * Retrieves a user by their username
   * @param username The username for the user we want to fetch
   */
  getUserByUsername(username: string) {
    const endpoint: string = `${environment.serverBase}${this.apiBase}/${username}`;
    return this.http.get<User>(endpoint);
  }

  /**
   * Given a username and a password, requests the user's account 
   * from the server in an attempt to log in to the user's account
   * @param username The username for the account being requested
   * @param password The unhashed password for the account being requested
   */
  login(username: string, password: string) {
    const endpoint: string = `${environment.serverBase}${this.apiBase}/login`;
    const login = { username, password };

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
    const endpoint: string = `${environment.serverBase}${this.apiBase}`;
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
   * Updates a user's information in the database
   * @param user The user to update in the database
   * @returns Observable containing the user we updated
   */
  updateUser(user: User): Observable<User> {
    const endpoint: string = `${environment.serverBase}${this.apiBase}/update`;
    return this.http.post<User>(endpoint, user);
  }

  /**
   * Removes a user's account from the database when they want to delete their
   * account
   * @param user The user to remove from the database (current user)
   */
  removeUser(user: User) {
    const endpoint: string = `${environment.serverBase}${this.apiBase}/${user.id}`;
    return this.http.delete<User>(endpoint);
  }

  /**
   * Updates the list of users with a new value
   * @param users The next value of users to update the observable with
   */
  updateObservableState(users: User[]) {
    this.usersSubject.next(users);
  }

}
