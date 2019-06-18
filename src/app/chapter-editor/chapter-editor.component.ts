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
  renameModalVisible = false;
  newChapterName: string;

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
  renamingChapter = false;

  ngOnInit() {
    this.courseService.getAllContentOfChapter(this.chapter.id).subscribe(
      (contents: Content[]) => {
        this.contents = contents;
        this.newChapterName = this.chapter.name;
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
    this.renameModalVisible = true;
  }

  private renameChapter() {
    this.renamingChapter = true;
    this.newChapterName = this.newChapterName.trim();

    if (this.newChapterName.length > 50) {
      this.notification.error('章节名过长', '章节名不能超过50个字符');
      this.renamingChapter = false;
      return;
    } else if (this.newChapterName.length === 0) {
      this.notification.error('章节名不能为空', '章节名至少需要1个字符');
      this.renamingChapter = false;
      return;
    }

    this.courseService.renameChapter(this.chapter.id, this.newChapterName).subscribe(
      () => {
        this.chapter.name = this.newChapterName;
        this.renamingChapter = false;
        this.renameModalVisible = false;
      }
    );
  }

  modifyContent(content: Content) {
    this.notification.error('出现错误', '功能还未上线，敬请期待');
  }

  deleteContent(content: Content) {
    this.notification.error('出现错误', '功能还未上线，敬请期待');
  }

  handleRenameCancel() {
    this.renameModalVisible = false;
  }
}
