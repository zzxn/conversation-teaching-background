import {Injectable} from '@angular/core';
import {Observable, Observer} from 'rxjs';
import {Course} from '../entity/course';
import {delay, timeout} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getAllCourseOfMine(): Observable<Course[]> {
    const uuid = localStorage.getItem('uuid');
    if (uuid === null) {
      return Observable.create((observer: Observer<object>) => {
        observer.error('未登录');
      });
    }
    return this.http.get<Course[]>('http://localhost:8080/teacher/' + uuid + '/course', {
      headers: {
        'Authorization': 'Bearer ' + this.authService.getToken()
      }
    }).pipe(
      delay(300),
      timeout(5000)
    );
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>('http://localhost:8080/course/' + id, {
      headers: {
        'Authorization': 'Bearer ' + this.authService.getToken()
      }
    }).pipe(
      delay(300),
      timeout(5000)
    );
  }
}
