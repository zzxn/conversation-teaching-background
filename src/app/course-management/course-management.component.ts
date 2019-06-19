import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CourseService} from '../service/course.service';
import {Course} from '../entity/course';
import {NzListComponent, NzModalService, NzNotificationService} from 'ng-zorro-antd';

@Component({
  selector: 'app-course-management',
  templateUrl: './course-management.component.html',
  styleUrls: ['./course-management.component.css']
})
export class CourseManagementComponent implements OnInit {
  isLoading = true;

  courses: Course[];
  creatingCourse = false;

  constructor(private router: Router, private courseService: CourseService, private modalService: NzModalService,
              private notification: NzNotificationService) {
    this.notification.config({
      nzPlacement: 'bottomRight',
      nzMaxStack: 2
    });
  }

  ngOnInit() {
    this.isLoading = true;
    this.courseService.getAllCourseOfMine().subscribe(
      (courses: Course[]) => {
        this.isLoading = false;
        this.courses = courses;
      },
      (errorMsg) => {
        if (errorMsg.hasOwnProperty('error') && errorMsg.error.code === 'auth:bad-token') {
          this.notification.error('身份令牌失效', '请登出后重新登录');
        } else {
          this.notification.error('网络异常', '联系服务器出错');
        }
      }
    );
  }

  enterCourse(id: number) {
    this.router.navigateByUrl('/course/' + id);
  }

  createCourse(name: string, courseList: NzListComponent) {
    name = name ? name.trim() : name;
    if (name.length === 0) {
      this.notification.error('课程名不能为空', '请至少输入 1 个字符');
      return;
    } else if (name.length > 32) {
      this.notification.error('课程名过长', '课程名不应超过 32 个字符');
      return;
    }

    this.creatingCourse = true;
    this.courseService.createCourse(name).subscribe(
      (course: Course) => {
        this.courses = [...this.courses, course]; // must do it in this way, or the list won't re-render
        this.creatingCourse = false;
      },
      (errorMsg) => {
        if (errorMsg.hasOwnProperty('error') && errorMsg.error.code === 'auth:bad-token') {
          this.notification.error('身份令牌失效', '请登出后重新登录');
        } else {
          this.notification.error('网络异常', '联系服务器出错');
        }
        this.creatingCourse = false;
      }
    );
  }
}
