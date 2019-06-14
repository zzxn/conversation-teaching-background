import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  errorMsg: string;

  constructor(private authService: AuthService, private router: Router) {
  }

  login(username: string, password: string) {
    this.authService.login(username, password).subscribe(
      (redirectUrl) => this.router.navigateByUrl(redirectUrl),
      (errorMsg) => {
        console.log(errorMsg);
        this.errorMsg = errorMsg;
      }
    );
  }
}
