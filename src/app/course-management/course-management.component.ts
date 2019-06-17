import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CourseService} from '../service/course.service';
import {Course} from '../entity/course';
import {NzModalService} from 'ng-zorro-antd';

@Component({
  selector: 'app-course-management',
  templateUrl: './course-management.component.html',
  styleUrls: ['./course-management.component.css']
})
export class CourseManagementComponent implements OnInit {
  isLoading = true;

  courses: Course[];

  constructor(private router: Router, private courseService: CourseService, private modalService: NzModalService) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.courseService.getAllCourseOfMine().subscribe(
      (courses: Course[]) => {
        this.isLoading = false;
        this.courses = courses;
      },
      error => {
        this.modalService.error({
          nzTitle: '<i>网络异常或服务器错误</i>',
          nzContent: '<b>请刷新重试或尝试重新登录</b>'
        });
        console.log(error);
      }
    );
  }

  enterCourse(id: number) {
    this.router.navigateByUrl('/course/' + id);
  }
}
