import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

// Models
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  /**
   * apiBase         - The url addition for the backend user routes
   * usersSubject    - BehaviorSubject containing the active users on
   *                   the app
   * usersObservable - Observable version of the subject for subscribing to
   */
  private apiBase: string = 'api/users';
  private usersSubject: BehaviorSubject<User[]>;
  private usersObservable: Observable<User[]>;

  constructor(private http: HttpClient) { 
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
   * Return the current user observable to the calling routine
   */
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  /**
   * Given a username and a password, requests the user's account 
   * from the server in an attempt to log in to the user's account
   * @param username The username for the account being requested
   * @param password The unhashed password for the account being requested
   * @returns The user who successfully logged in or error information
   */
  login(username: string, password: string): Observable<User> {
    const endpoint: string = `${environment.serverBase}${this.apiBase}/login`;
    const login = { username, password };

    return this.http.post<User>(endpoint, login);
  }

  /**
   * Sends a request to the sever to create a new user
   * @param username The username for the new user
   * @param password The password for the new user
   * @returns An Observable containing the newly created user
   */
  createAccount(username: string, password: string): Observable<User> {
    const endpoint: string = `${environment.serverBase}${this.apiBase}`;
    let newUser = {
      username: username,
      password: password
    };

    return this.http.post<User>(endpoint, newUser);
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
