import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {Chapter} from '../entity/chapter';
import {NzModalService} from 'ng-zorro-antd';
import {CourseService} from '../service/course.service';
import {Course} from '../entity/course';

@Component({
  selector: 'app-course',
  templateUrl: './course-chapter.component.html',
  styleUrls: ['./course-chapter.component.css']
})
export class CourseChapterComponent implements OnInit {
  id: number;
  courseLoading = true;
  chapterLoading = true;
  isCollapsed = false;

  course: Course;

  chapters: Chapter[];

  constructor(
    private route: ActivatedRoute,
    private modalService: NzModalService,
    private router: Router,
    private courseService: CourseService
  ) {
  }

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id');
    this.courseService.getCourseById(this.id).subscribe(
      (course: Course) => {
        this.course = course;
        this.courseLoading = false;
      }
    );
    this.courseService.getAllChapterOfCourse(this.id).subscribe(
      (chapters: Chapter[]) => {
        this.chapters = chapters;
        this.chapterLoading = false;
      }
    );
  }

  deleteChapter(chapter: Chapter) {
    this.modalService.confirm({
      nzTitle: '确定删除这个章节吗？',
      nzContent: '<b style="color: red;">所有消息和问题都会一同删除，且不可恢复</b>',
      nzOkText: '仍要删除',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.chapters.splice(
          this.chapters.findIndex((c) => c.id === chapter.id), 1
        );
      },
      nzCancelText: '我再想想',
    });
  }
}
