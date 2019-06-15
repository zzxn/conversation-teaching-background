import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  errorMsg: string;
  validateForm: FormGroup;
  registering = false;


  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.validateForm = this.fb.group({
      username: ['', [this.usernameValidator]],
      password: ['', [this.passwordValidator]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submitForm(): void {
    // tslint:disable-next-line:forin
    this.registering = true;

    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();

    }

    const username = this.validateForm.controls.username.value;
    const password = this.validateForm.controls.password.value;
    const email = this.validateForm.controls.email.value;

    this.authService.register(username, password, email).subscribe(
      (redirectUrl) => {
        this.registering = false;
        this.router.navigateByUrl(redirectUrl);
      },
      (errorMsg) => {
        if (errorMsg.hasOwnProperty('name') && errorMsg.name === 'TimeoutError') {
          this.errorMsg = '请求超时';
        } else {
          this.errorMsg = errorMsg;
        }

        this.registering = false;
      }
    );
  }

  usernameValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {required: true};
    } else if (control.value.toString().length < 4) {
      return {short: true};
    } else if (control.value.toString().length > 20) {
      return {long: true};
    } else if (!/^[a-zA-Z]+[0-9]*$/.test(control.value.toString())) {
      return {invalid: true};
    }
    return {};
  };

  passwordValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {required: true};
    } else if (control.value.toString().length < 6) {
      return {short: true};
    } else if (control.value.toString().length > 20) {
      return {long: true};
    } else if (/^[0-9]+$/.test(control.value.toString())) {
      return {onlyNumber: true};
    }
    return {};
  };
}
