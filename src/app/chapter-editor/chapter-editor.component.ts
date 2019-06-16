import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Chapter} from '../chapter';
import {NzMessageService, NzNotificationService} from 'ng-zorro-antd';

@Component({
  selector: 'app-chapter-editor',
  templateUrl: './chapter-editor.component.html',
  styleUrls: ['./chapter-editor.component.css']
})
export class ChapterEditorComponent implements OnInit {
  messageType = 'plain';

  constructor(private notification: NzNotificationService) {
    this.notification.config({
      nzPlacement: 'bottomRight'
    });
  }

  @Input()
  chapter: Chapter;

  @Output()
  delete = new EventEmitter<Chapter>();



  ngOnInit() {
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
}
