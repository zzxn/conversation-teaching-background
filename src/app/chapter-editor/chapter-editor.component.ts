import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Chapter} from '../entity/chapter';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CourseService} from '../service/course.service';
import {Content} from '../entity/content';
import {Option} from '../entity/option';

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
  creatingMessage = false;

  constructor(private notification: NzNotificationService,
              private courseService: CourseService,
              private modalService: NzModalService) {
    this.notification.config({
      nzPlacement: 'bottomRight',
      nzMaxStack: 2
    });
  }

  @Input()
  chapter: Chapter;

  @Output()
  delete = new EventEmitter<Chapter>();

  contents: Content[];
  renamingChapter = false;

  plainContent = '';
  questionContent = '';
  correctAnswer = 0;
  options: Option[];

  ngOnInit() {
    this.courseService.getAllContentOfChapter(this.chapter.id).subscribe(
      (contents: Content[]) => {
        this.contents = contents;
        this.newChapterName = this.chapter.name;
        this.isLoading = false;
      },
      (errorMsg) => {
        if (errorMsg.hasOwnProperty('error') && errorMsg.error.code === 'auth:bad-token') {
          this.notification.error('身份令牌失效', '请登出后重新登录');
          this.isLoading = false;
        } else {
          this.notification.error('网络异常', '联系服务器出错');
        }
      }
    );

    this.options = [];
    for (let i = 1; i <= 4; i++) {
      this.options.push({
        id: -1,
        optionId: i,
        isCorrect: false,
        text: '',
        contentId: -1,
      });
    }
  }

  switchMessageType() {
    this.messageType = (this.messageType === 'plain' ? 'question' : 'plain');
  }

  createMessage() {
    let contentText = this.messageType === 'plain' ? this.plainContent : this.questionContent;
    contentText = contentText.trim();
    if (contentText.length === 0 || contentText.length > 80) {
      this.notification.error('消息长度不合法', '消息的长度必须在 1 个字符到 50 个字符之间');
      return;
    } else if (this.messageType === 'question' && this.correctAnswer === 0) {
      this.notification.error('必须选择正确答案', '请选择四个选项中的一个作为正确答案');
      return;
    }

    this.creatingMessage = true;

    if (this.messageType === 'question') {
      this.options[this.correctAnswer - 1].isCorrect = true;
    }

    const content: Content = {
      id: -1,
      text: contentText,
      type: this.messageType === 'plain' ? 1 : 2,
      chapter_id: this.chapter.id,
      next_content: null,
      options: this.messageType === 'plain' ? null : this.options
    };

    console.log(content);

    this.courseService.createContent(this.chapter.id, content).subscribe(
      (newContent: Content) => {
        this.contents.push(newContent);
        this.clearContent();
        this.creatingMessage = false;
      },
      (errorMsg) => {
        if (errorMsg.hasOwnProperty('error') && errorMsg.error.code === 'auth:bad-token') {
          this.notification.error('身份令牌失效', '请登出后重新登录');
          this.isLoading = false;
        } else {
          this.notification.error('网络异常', '联系服务器出错');
        }
      }
    );
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
    this.modalService.confirm({
      nzTitle: '确定删除这个消息吗？',
      nzContent: '<b style="color: red;">删除消息可能导致学生端不一致问题，且删除不可恢复，确定删除吗？</b>',
      nzOkText: '仍要删除',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.contents.splice(this.contents.indexOf(content), 1);
        this.courseService.deleteContent(content.id).subscribe(
          () => {
            this.notification.success('成功删除消息', '内容为 “' + content.text + '”的消息已成功被删除');
          },
          (errorMsg) => {
            if (errorMsg.hasOwnProperty('error') && errorMsg.error.code === 'auth:bad-token') {
              this.notification.error('身份令牌失效', '请登出后重新登录');
              this.isLoading = false;
            } else {
              this.notification.error('网络异常', '联系服务器出错');
            }
          }
        );
      },
      nzCancelText: '我再想想',
    });
  }

  handleRenameCancel() {
    this.renameModalVisible = false;
  }

  clearContent() {
    this.plainContent = '';
    this.questionContent = '';
    this.correctAnswer = 0;
    for (const option of this.options) {
      option.isCorrect = false;
      option.text = '';
    }
  }
}
