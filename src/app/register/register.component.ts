import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  errorMsg: string;

  constructor(private authService: AuthService, private router: Router) {
  }

  register(username: string, password: string, email: string) {
    this.authService.register(username, password, email).subscribe(
      (redirectUrl) => this.router.navigateByUrl(redirectUrl),
      (errorMsg) => {
        console.log(errorMsg);
        this.errorMsg = errorMsg;
      }
    );
  }
}
