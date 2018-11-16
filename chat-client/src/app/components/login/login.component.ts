import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup; // For existing users
  public createForm: FormGroup; // For new accounts
  public welcome: string = 'CryptoChat';

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl(null, [
        Validators.required
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8)
      ])
    });

    this.createForm = new FormGroup({
      username: new FormControl(null, [
        Validators.required,
        Validators.minLength(4)
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8)
      ]),
      confirm: new FormControl(null, [
        Validators.required,
        Validators.minLength(8)
      ])
    });
  }

  // Get username and password and sanitize values before login
  login() {
    let username = this.loginForm.controls['username'].value;
    let password = this.loginForm.controls['password'].value;

    username = this.sanitizeInput(username);
    password = this.sanitizeInput(password);
    if (username === "" || password === "") {
      this.loginForm.reset();
    } else {
      this.loginForm.reset();
      this.userService.login(username, password);
    }
  }

  // Get username and password and sanitize values before account creation
  createAccount() {
    let username = this.createForm.controls['username'].value;
    let password = this.createForm.controls['password'].value;

    username = this.sanitizeInput(username);
    password = this.sanitizeInput(password);

    if (username === "" || password === "") {
      this.createForm.reset();
    } else {
      this.createForm.reset();
      this.userService.createAccount(username, password);
    }
  }

  // Strip whitespace from input for sanitation purposes to avoid bad input
  sanitizeInput(input: string): string {
    return input.trim();
  }

  /**
   * Check to see that passwords actually match
   */
  passwordMatch() {
    return !(this.createForm.controls['password'].value === this.createForm.controls['confirm'].value);
  }

}
