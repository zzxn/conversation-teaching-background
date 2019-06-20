import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Chapter} from '../entity/chapter';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
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
  creatingChapter = false;
  isCollapsed = false;
  course: Course;
  chapters: Chapter[];
  private chapterDirty = false;

  constructor(
    private route: ActivatedRoute,
    private modalService: NzModalService,
    private notification: NzNotificationService,
    private router: Router,
    private courseService: CourseService
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
      },
      (errorMsg) => {
        if (errorMsg.hasOwnProperty('error') && errorMsg.error.code === 'auth:bad-token') {
          this.notification.error('身份令牌失效', '请登出后重新登录');
        } else {
          this.notification.error('网络异常', '联系服务器出错');
        }
      }
    );
    this.courseService.getAllChapterOfCourse(this.id).subscribe(
      (chapters: Chapter[]) => {
        this.chapters = chapters;
        this.chapterLoading = false;
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
        this.courseService.deleteChapter(chapter.id).subscribe(
          () => {
            this.notification.success('成功删除章节', '章节《' + chapter.name + '》已被成功删除');
          },
          (errorMsg) => {
            if (errorMsg.hasOwnProperty('error') && errorMsg.error.code === 'auth:bad-token') {
              this.notification.error('身份令牌失效', '请登出后重新登录');
            } else {
              this.notification.error('网络异常', '联系服务器出错');
            }
          }
        );
      },
      nzCancelText: '我再想想',
    });
  }

  createChapter(nameInput: HTMLInputElement) {
    const name = nameInput.value.trim();
    if (name.length > 50) {
      this.notification.error('章节名过长', '章节名不能超过50个字符');
    } else if (name.length === 0) {
      this.notification.error('章节名不能为空', '章节名至少需要1个字符');
    } else {
      this.creatingChapter = true;
      this.courseService.createChapter(this.course.id, name).subscribe(
        (chapter: Chapter) => {
          this.chapters.push(chapter);
          nameInput.value = '';
          this.creatingChapter = false;
        },
        (errorMsg) => {
          if (errorMsg.hasOwnProperty('error') && errorMsg.error.code === 'auth:bad-token') {
            this.notification.error('身份令牌失效', '请登出后重新登录');
          } else {
            this.notification.error('网络异常', '联系服务器出错');
          }
          this.creatingChapter = false;
        }
      );
    }
  }
}
