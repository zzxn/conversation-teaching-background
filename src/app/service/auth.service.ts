import {Injectable} from '@angular/core';
import {Observable, Observer} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {timeout} from 'rxjs/operators';
import {Md5} from 'ts-md5';
import {Config} from '../config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  redirectUrl = '/';
  private loginApiUrl = Config.serverUrl + '/login';
  private registerApiUrl = Config.serverUrl + '/register';

  constructor(private http: HttpClient) {
  }

  private _loginUrl = '/login';

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
    password = Md5.hashStr(password).toString(); // hash the password

    return Observable.create((observer: Observer<string>) => {
      this.http.post(this.loginApiUrl, {
        'username': username,
        'password': password
      }).subscribe(
        (tokenResponse: TokenResponse) => {
          localStorage.setItem('token', tokenResponse.token);
          localStorage.setItem('uuid', tokenResponse.uuid);
          observer.next(this.redirectUrl);
        },
        (error) => {
          if (error.hasOwnProperty('error') && error.error.code === 'auth:bad-name-pass') {
            observer.error('用户名或密码错误');
          }
          console.error(error);
          observer.error('网络异常');
        }
      );
    }).pipe(timeout(3000));
  }

  register(username: string, password: string, email: string): Observable<string> {
    password = Md5.hashStr(password).toString(); // hash the password

    return Observable.create((observer: Observer<string>) => {
      this.http.post(this.registerApiUrl, {
        'username': username,
        'password': password,
        'email': email
      }).subscribe(
        (tokenResponse: TokenResponse) => {
          localStorage.setItem('token', tokenResponse.token);
          localStorage.setItem('uuid', tokenResponse.uuid);
          observer.next(this.redirectUrl);
        },
        (error) => {
          if (error.hasOwnProperty('error') && error.error.code === 'auth:dup-name') {
            observer.error('用户名重复');
          }
          console.error(error);
          observer.error('网络异常');
        }
      );
    }).pipe(timeout(3000));
  }

  logout() {
    localStorage.removeItem('uuid');
    localStorage.removeItem('token');
  }

}

class TokenResponse {
  uuid: string;
  token: string;
}
