import {Injectable} from '@angular/core';
import {Observable, Observer} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {timeout} from 'rxjs/operators';

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

  getToken() {
    const token = localStorage.getItem('token');
    return token ? token : undefined;
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
          localStorage.setItem('uuid', tokenResponse.uuid);
          observer.next(this.redirectUrl);
        },
        (error) => {
          if (error.hasOwnProperty('error') && error.error.code === 'auth:bad-name-pass') {
              observer.error('用户名或密码错误');
          }
          console.log(error);
          observer.error('网络异常');
        }
      );
    }).pipe(timeout(3000));
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
          localStorage.setItem('uuid', tokenResponse.uuid);
          observer.next(this.redirectUrl);
        },
        (error) => {
          if (error.hasOwnProperty('error') && error.error.code === 'auth:dup-name') {
              observer.error('用户名重复');
          }
          console.log(error);
          observer.error('网络异常');
        }
      );
    }).pipe(timeout(3000));
  }

  logout() {
    localStorage.removeItem('token');
  }

}

class TokenResponse {
  uuid: string;
  token: string;
}