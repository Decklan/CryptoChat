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

  login() {
    const username = this.loginForm.controls['username'].value;
    const password = this.loginForm.controls['password'].value;

    this.userService.login(username, password);
  }

  createAccount() {
    const username = this.createForm.controls['username'].value;
    const password = this.createForm.controls['password'].value;

    this.userService.createAccount(username, password);
  }

}
