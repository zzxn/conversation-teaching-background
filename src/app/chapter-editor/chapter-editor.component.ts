import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Chapter} from '../entity/chapter';
import {NzMessageService, NzNotificationService} from 'ng-zorro-antd';
import {CourseService} from '../service/course.service';
import {Content} from '../entity/content';

@Component({
  selector: 'app-chapter-editor',
  templateUrl: './chapter-editor.component.html',
  styleUrls: ['./chapter-editor.component.css']
})
export class ChapterEditorComponent implements OnInit {
  messageType = 'plain';
  isLoading = true;

  constructor(private notification: NzNotificationService, private courseService: CourseService) {
    this.notification.config({
      nzPlacement: 'bottomRight'
    });
  }

  @Input()
  chapter: Chapter;

  @Output()
  delete = new EventEmitter<Chapter>();

  contents: Content[];

  ngOnInit() {
    this.courseService.getAllContentOfChapter(this.chapter.id).subscribe(
      (contents: Content[]) => {
        this.contents = contents;
        this.isLoading = false;
      }
    );
  }

  switchMessageType() {
    this.messageType = (this.messageType === 'plain' ? 'question' : 'plain');
  }

  addMessage() {
    this.notification.error('出现错误', '功能还未上线，敬请期待');
  }

  deleteThisChapter($event: MouseEvent) {
    $event.stopPropagation();
    this.delete.emit(this.chapter);
  }

  renameThisChapter($event: MouseEvent) {
    $event.stopPropagation();
    this.notification.error('出现错误', '功能还未上线，敬请期待');
  }

  modifyContent(content: Content) {
    this.notification.error('出现错误', '功能还未上线，敬请期待');
  }

  deleteContent(content: Content) {
    this.notification.error('出现错误', '功能还未上线，敬请期待');
  }
}
