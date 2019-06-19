import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CourseService} from '../service/course.service';
import {Course} from '../entity/course';
import {NzListComponent, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-course-management',
  templateUrl: './course-management.component.html',
  styleUrls: ['./course-management.component.css']
})
export class CourseManagementComponent implements OnInit {
  isLoading = true;

  courses: Course[];
  creatingCourse = false;

  cardStyleList = [
    'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)',
    'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)',
    'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
    'linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)',
    'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
    'linear-gradient(to top, #505285 0%, #585e92 12%, #65689f 25%, #7474b0 37%, ' +
    '#7e7ebb 50%, #8389c7 62%, #9795d4 75%, #a2a1dc 87%, #b5aee4 100%)',
    'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
    'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)',
    'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(to right, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(to top, #0ba360 0%, #3cba92 100%)',
    'linear-gradient(to top, #a3bded 0%, #6991c7 100%)'
  ];

  constructor(private router: Router, private courseService: CourseService, private modalService: NzModalService,
              private notification: NzNotificationService, private domSanitizer: DomSanitizer) {
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
