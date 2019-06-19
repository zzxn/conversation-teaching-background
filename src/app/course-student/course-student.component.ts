import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Course} from '../entity/course';
import {CourseService} from '../service/course.service';
import {Student} from '../entity/student';
import {NzModalService} from 'ng-zorro-antd';

@Component({
  selector: 'app-course',
  templateUrl: './course-student.component.html',
  styleUrls: ['./course-student.component.css']
})
export class CourseStudentComponent implements OnInit {
  id: number;
  isCollapsed = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router, private courseService: CourseService,
    private modalService: NzModalService
  ) {
  }

  course: Course;

  students: Student[];
  studentLoading = true;
  courseLoading = true;

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
      }
    );
  }

  // linkToStudent(id: number) {
  //   this.router.navigateByUrl('/course/' + this.course.id + '/student/' + id);
  // }
}
