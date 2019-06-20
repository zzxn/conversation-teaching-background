import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Course} from '../entity/course';
import {CourseService} from '../service/course.service';
import {Student} from '../entity/student';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {StudentStatistics} from '../entity/student-statistics';

@Component({
  selector: 'app-course',
  templateUrl: './course-student.component.html',
  styleUrls: ['./course-student.component.css']
})
export class CourseStudentComponent implements OnInit {
  id: number;
  isCollapsed = false;
  course: Course;
  students: Student[];
  studentStatisticsMap = new Map<string, StudentStatistics>();
  studentLoading = true;
  courseLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router, private courseService: CourseService,
    private modalService: NzModalService,
    private notification: NzNotificationService
  ) {
    this.notification.config({
      nzPlacement: 'bottomRight',
      nzMaxStack: 2
    });
  }

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id');
    this.courseService.getCourseById(this.id).subscribe(
      (course: Course) => {
        this.course = course;
        this.courseLoading = false;
      }
    );
    this.courseService.getAllStudentOfCourse(this.id).subscribe(
      (students: Student[]) => {
        this.students = students;
        this.studentLoading = false;
        for (const student of this.students) {
          this.getStatistics(student.uuid);
        }
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

  getStatistics(studentUuid: string): void {
    this.courseService.getStudentStatistics(this.course.id, studentUuid).subscribe(
      (statistics: StudentStatistics) => {
        this.studentStatisticsMap.set(studentUuid, statistics);
        console.log(this.studentStatisticsMap);
      }
    );
  }

  // linkToStudent(id: number) {
  //   this.router.navigateByUrl('/course/' + this.course.id + '/student/' + id);
  // }
}
