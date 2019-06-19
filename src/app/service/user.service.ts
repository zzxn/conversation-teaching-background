import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {HttpClient} from '@angular/common/http';
import {Observable, Observer} from 'rxjs';
import {User} from '../entity/user';
import {delay, timeout} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private authService: AuthService, private http: HttpClient, private router: Router) {
  }

  getUserInfo(): Observable<User> {
    const uuid = localStorage.getItem('uuid');
    if (uuid === null) {
      return Observable.create((observer: Observer<User>) => {
        observer.error('未登录');
      });
    }
    return this.http.get<User>('http://localhost:8080/user/' + uuid, {
      headers: {
        'Authorization': 'Bearer ' + this.authService.getToken()
      }
    }).pipe(
      timeout(5000)
    );
  }

  updateUser(user: User): Observable<object> {
    const uuid = localStorage.getItem('uuid');
    if (uuid === null) {
      return Observable.create((observer: Observer<object>) => {
        observer.error('未登录');
      });
    }
    return this.http.put('http://localhost:8080/user/' + uuid, user, {
      headers: {
        'Authorization': 'Bearer ' + this.authService.getToken()
      }
    }).pipe(
      timeout(5000)
    );
  }

  updatePassword(password: string): Observable<object> {
    const uuid = localStorage.getItem('uuid');
    if (uuid === null) {
      return Observable.create((observer: Observer<object>) => {
        observer.error('未登录');
      });
    }
    return this.http.post('http://localhost:8080/update-password/' + uuid, null, {
      params: {'password': password},
      headers: {
        'Authorization': 'Bearer ' + this.authService.getToken()
      }
    }).pipe(
      timeout(5000)
    );
  }

  validPassword(password: string): Observable<object> {
    const uuid = localStorage.getItem('uuid');
    if (uuid === null) {
      return Observable.create((observer: Observer<object>) => {
        observer.error('未登录');
      });
    }
    return this.http.post('http://localhost:8080/validate-password/' + uuid, null, {
      params: {'password': password},
      headers: {
        'Authorization': 'Bearer ' + this.authService.getToken()
      }
    }).pipe(
      timeout(1000)
    );
  }

  logoutAndRedirect(): void {
    this.authService.logout();
    this.router.navigateByUrl(this.authService.loginUrl);
  }
}
