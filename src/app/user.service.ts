import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {HttpClient} from '@angular/common/http';
import {Observable, Observer} from 'rxjs';
import {User} from './user';
import {delay, timeout} from 'rxjs/operators';
import {error} from '@angular/compiler/src/util';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private authService: AuthService, private http: HttpClient) {
  }

  getUserInfo(): Observable<User> {
    const uuid = localStorage.getItem('uuid');
    if (uuid === null) {
      return Observable.create((observer: Observer<User>) => {
        observer.error('未登录');
      });
    }
    return this.http.get<User>('http://localhost:8080/user/' + uuid).pipe(
      delay(300),
      timeout(8000)
    );
  }

  updateUser(user: User): Observable<object> {
    const uuid = localStorage.getItem('uuid');
    if (uuid === null) {
      return Observable.create((observer: Observer<object>) => {
        observer.error('未登录');
      });
    }
    return this.http.put('http://localhost:8080/user/' + uuid, user).pipe(
      delay(300),
      timeout(8000)
    );
  }
}
