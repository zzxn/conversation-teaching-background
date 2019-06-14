import {Injectable} from '@angular/core';
import {Observable, Observer} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  redirectUrl = '/';
  private _loginUrl = '/login';
  private loginApiUrl = 'http://localhost:8080/login';
  private registerApiUrl = 'http://localhost:8080/register';

  constructor(private http: HttpClient) {
  }

  get loginUrl(): string {
    return this._loginUrl;
  }

  hasLogin(): boolean {
    return localStorage.getItem('token') != null;
  }

  login(username: string, password: string): Observable<string> {
    return Observable.create((observer: Observer<string>) => {
      this.http.post(this.loginApiUrl, {
        'username': username,
        'password': password
      }).subscribe(
        (tokenResponse: TokenResponse) => {
          console.log(tokenResponse);
          localStorage.setItem('token', tokenResponse.token);
          observer.next(this.redirectUrl);
        },
        (error) => {
          if (error.hasOwnProperty('error') && error.error.code === 'auth:bad-name-pass') {
            observer.error('用户名或密码错误');
          }
          console.log(error);
          return observer.error('未知错误');
        }
      );
    });
  }

  register(username: string, password: string, email: string): Observable<string> {
    return Observable.create((observer: Observer<string>) => {
      this.http.post(this.registerApiUrl, {
        'username': username,
        'password': password,
        'email': email
      }).subscribe(
        (tokenResponse: TokenResponse) => {
          console.log(tokenResponse);
          localStorage.setItem('token', tokenResponse.token);
          observer.next(this.redirectUrl);
        },
        (error) => {
          if (error.hasOwnProperty('error') && error.error.code === 'auth:dup-name') {
            observer.error('用户名重复');
          }
          console.log(error);
          return observer.error('未知错误');
        }
      );
    });
  }

  logout() {
    localStorage.removeItem('token');
  }

}

class TokenResponse {
  token: string;
}