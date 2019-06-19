import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {CourseService} from '../service/course.service';
import {Course} from '../entity/course';
import {NzButtonComponent, NzNotificationService} from 'ng-zorro-antd';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  id: number;
  isLoading = true;
  isCollapsed = false;
  course: Course;
  applying = false;
  nameValid = true;
  descriptionValid = true;
  deleteModalVisible = false;
  assureDeleteText: string;
  deletingCourse = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private notification: NzNotificationService
  ) {
  }

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id');
    this.courseService.getCourseById(this.id).subscribe(
      (course: Course) => {
        this.course = course;
        this.isLoading = false;
      }
    );
  }

  applyModify() {
    // console.log(this.user);
    if (this.applying || !this.nameValid || !this.descriptionValid) {
      return;
    }
    this.applying = true;
    this.courseService.updateCourse(this.course)
      .subscribe(
        () => {
          console.log('success!!!!!!!!!!');
          this.applying = false;
        }
      );
  }

  validateCourseName(courseName: string): boolean {
    return courseName.length > 0 && courseName.length <= 32;
  }

  validateCourseDescription(descrption: string): boolean {
    return descrption.length <= 512;
  }

  makeEditable(inputElement: HTMLInputElement | HTMLTextAreaElement, buttonElement: NzButtonComponent) {
    // we must do it in setTimeout() because of the limitation of Angular
    inputElement.readOnly = false;
    inputElement.focus();
    buttonElement.el.hidden = true;
  }

  deleteCourse() {
    this.deleteModalVisible = true;
    if (this.assureDeleteText !== '删除') {
      this.notification.error('请确认删除', '请在输入框输入“删除”以确认删除本课程');
      return;
    }
    this.deletingCourse = true;
    this.courseService.deleteCourse(this.course.id).subscribe(
      () => {
        this.router.navigateByUrl('/');
      },
    (error) => {
        this.deletingCourse = false;
        this.notification.error('删除失败', '由于网络原因或令牌失效，删除课程失败');
        console.log(error);
    }
    );
  }
}
