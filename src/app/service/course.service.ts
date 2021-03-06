import {Injectable} from '@angular/core';
import {Observable, Observer} from 'rxjs';
import {Course} from '../entity/course';
import {timeout} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Chapter} from '../entity/chapter';
import {Content} from '../entity/content';
import {Student} from '../entity/student';
import {StudentStatistics} from '../entity/student-statistics';
import {Config} from '../config';

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
    return this.http.get<Course[]>(Config.serverUrl + '/teacher/' + uuid + '/course', {
      headers: {
        'Authorization': 'Bearer ' + this.authService.getToken()
      }
    }).pipe(
      timeout(5000)
    );
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(Config.serverUrl + '/course/' + id, {
      headers: {
        'Authorization': 'Bearer ' + this.authService.getToken()
      }
    }).pipe(
      timeout(5000)
    );
  }

  updateCourse(course: Course): Observable<void> {
    return this.http.put<void>(Config.serverUrl + '/course/' + course.id, course, {
      headers: {
        'Authorization': 'Bearer ' + this.authService.getToken()
      }
    }).pipe(
      timeout(5000)
    );
  }

  createCourse(courseName: string): Observable<Course> {
    const uuid = localStorage.getItem('uuid');
    return this.http.post<Course>(Config.serverUrl + '/teacher/' + uuid + '/course/' + courseName, null, {
      headers: {
        'Authorization': 'Bearer ' + this.authService.getToken()
      }
    }).pipe(
      timeout(5000)
    );
  }

  deleteCourse(courseId: number): Observable<void> {
    return this.http.delete<void>(Config.serverUrl + '/course/' + courseId, {
      headers: {
        'Authorization': 'Bearer ' + this.authService.getToken()
      }
    }).pipe(
      timeout(5000)
    );
  }

  getAllChapterOfCourse(courseId: number): Observable<Chapter[]> {
    return this.http.get<Chapter[]>(Config.serverUrl + '/course/' + courseId + '/chapter', {
      headers: {
        'Authorization': 'Bearer ' + this.authService.getToken()
      }
    }).pipe(
      timeout(5000)
    );
  }

  getAllContentOfChapter(chapterId: number): Observable<Content[]> {
    return this.http.get<Content[]>(Config.serverUrl + '/chapter/' + chapterId + '/content', {
      headers: {
        'Authorization': 'Bearer ' + this.authService.getToken()
      }
    }).pipe(
      timeout(5000)
    );
  }

  getAllStudentOfCourse(courseId: number): Observable<Student[]> {
    return this.http.get<Student[]>(Config.serverUrl + '/course/' + courseId + '/student', {
      headers: {
        'Authorization': 'Bearer ' + this.authService.getToken()
      }
    }).pipe(
      timeout(5000)
    );
  }

  createChapter(courseId: number, chapterName: string): Observable<Chapter> {
    return this.http.post<Chapter>(Config.serverUrl + '/course/' + courseId + '/chapter/' + chapterName, null, {
      headers: {
        'Authorization': 'Bearer ' + this.authService.getToken()
      }
    }).pipe(
      timeout(5000)
    );
  }

  deleteChapter(chapterId: number): Observable<void> {
    return this.http.delete<void>(Config.serverUrl + '/chapter/' + chapterId, {
      headers: {
        'Authorization': 'Bearer ' + this.authService.getToken()
      }
    }).pipe(
      timeout(5000)
    );
  }

  renameChapter(chapterId: number, chapterName: string): Observable<void> {
    return this.http.post<void>(Config.serverUrl + '/chapter/' + chapterId + '/name/' + chapterName, null, {
      headers: {
        'Authorization': 'Bearer ' + this.authService.getToken()
      }
    }).pipe(
      timeout(5000)
    );
  }

  createContent(chapterId: number, content: Content): Observable<Content> {
    return this.http.post<Content>(Config.serverUrl + '/chapter/' + chapterId + '/content', content, {
      headers: {
        'Authorization': 'Bearer ' + this.authService.getToken()
      }
    }).pipe(
      timeout(5000)
    );
  }

  deleteContent(contentId: number): Observable<void> {
    return this.http.delete<void>(Config.serverUrl + '/content/' + contentId, {
      headers: {
        'Authorization': 'Bearer ' + this.authService.getToken()
      }
    }).pipe(
      timeout(5000)
    );
  }

  getStudentStatistics(courseId: number, studentUuid: string): Observable<StudentStatistics> {
    return this.http.get<StudentStatistics>(Config.serverUrl + '/course/'
      + courseId + '/student/' + studentUuid + '/statistics', {
      headers: {
        'Authorization': 'Bearer ' + this.authService.getToken()
      }
    }).pipe(
      timeout(5000)
    );
  }
}
