import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {CourseService} from '../service/course.service';
import {Course} from '../entity/course';
import {NzButtonComponent} from 'ng-zorro-antd';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService
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
}
