import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {Chapter} from '../entity/chapter';
import {NzModalService} from 'ng-zorro-antd';

@Component({
  selector: 'app-course',
  templateUrl: './course-chapter.component.html',
  styleUrls: ['./course-chapter.component.css']
})
export class CourseChapterComponent implements OnInit {
  id: number;
  isLoading = false;
  isCollapsed = false;

  course = {
    id: 1,
    name: '计算机图形学',
    description: '计算机图形学(Computer Graphics，简称CG)是一种使用数学算法' +
      '将二维或三维图形转化为计算机显示器的栅格形式的科学。简单地说，计算机图形学的' +
      '主要研究内容就是研究如何在计算机中表示图形、以及利用计算机进行图形的计算、' +
      '处理和显示的相关原理与算法。',
    select_num: 34
  };

  chapters = [
    {
      id: 1,
      name: '简介',
      messages: [
        '计算机图形学(Computer Graphics，简称CG)是一种使用数学算法' +
        '将二维或三维图形转化为计算机显示器的栅格形式的科学',
        '简单地说，计算机图形学的' +
        '主要研究内容就是研究如何在计算机中表示图形、',
        '以及利用计算机进行图形的计算、' +
        '处理和显示的相关原理与算法。',
        '计算机图形学(Computer Graphics，简称CG)是一种使用数学算法' +
        '将二维或三维图形转化为计算机显示器的栅格形式的科学',
        '简单地说，计算机图形学的' +
        '主要研究内容就是研究如何在计算机中表示图形、',
        '以及利用计算机进行图形的计算、' +
        '处理和显示的相关原理与算法。',
        '计算机图形学(Computer Graphics，简称CG)是一种使用数学算法' +
        '将二维或三维图形转化为计算机显示器的栅格形式的科学',
        '简单地说，计算机图形学的' +
        '主要研究内容就是研究如何在计算机中表示图形、',
        '以及利用计算机进行图形的计算、' +
        '处理和显示的相关原理与算法。',
        '计算机图形学(Computer Graphics，简称CG)是一种使用数学算法' +
        '将二维或三维图形转化为计算机显示器的栅格形式的科学',
        '简单地说，计算机图形学的' +
        '主要研究内容就是研究如何在计算机中表示图形、',
        '以及利用计算机进行图形的计算、' +
        '处理和显示的相关原理与算法。',
        '计算机图形学(Computer Graphics，简称CG)是一种使用数学算法' +
        '将二维或三维图形转化为计算机显示器的栅格形式的科学',
        '简单地说，计算机图形学的' +
        '主要研究内容就是研究如何在计算机中表示图形、',
        '以及利用计算机进行图形的计算、' +
        '处理和显示的相关原理与算法。',
        '计算机图形学(Computer Graphics，简称CG)是一种使用数学算法' +
        '将二维或三维图形转化为计算机显示器的栅格形式的科学',
        '简单地说，计算机图形学的' +
        '主要研究内容就是研究如何在计算机中表示图形、',
        '以及利用计算机进行图形的计算、' +
        '处理和显示的相关原理与算法。'
      ]
    },
    {
      id: 2,
      name: '坐标系',
      messages: [
        '计算机图形学(Computer Graphics，简称CG)是一种使用数学算法' +
        '将二维或三维图形转化为计算机显示器的栅格形式的科学',
        '简单地说，计算机图形学的' +
        '主要研究内容就是研究如何在计算机中表示图形、',
        '以及利用计算机进行图形的计算、' +
        '处理和显示的相关原理与算法。'
      ]
    },
    {
      id: 3,
      name: '图形渲染流水线',
      messages: [
        '计算机图形学(Computer Graphics，简称CG)是一种使用数学算法' +
        '将二维或三维图形转化为计算机显示器的栅格形式的科学',
        '简单地说，计算机图形学的' +
        '主要研究内容就是研究如何在计算机中表示图形、',
        '以及利用计算机进行图形的计算、' +
        '处理和显示的相关原理与算法。'
      ]
    },
    {
      id: 4,
      name: 'canvas和WebGL',
      messages: [
        '计算机图形学(Computer Graphics，简称CG)是一种使用数学算法' +
        '将二维或三维图形转化为计算机显示器的栅格形式的科学',
        '简单地说，计算机图形学的' +
        '主要研究内容就是研究如何在计算机中表示图形、',
        '以及利用计算机进行图形的计算、' +
        '处理和显示的相关原理与算法。'
      ]
    }, {
      id: 5,
      name: '在浏览器中使用WebGL',
      messages: [
        '计算机图形学(Computer Graphics，简称CG)是一种使用数学算法' +
        '将二维或三维图形转化为计算机显示器的栅格形式的科学',
        '简单地说，计算机图形学的' +
        '主要研究内容就是研究如何在计算机中表示图形、',
        '以及利用计算机进行图形的计算、' +
        '处理和显示的相关原理与算法。'
      ]
    }, {
      id: 6,
      name: '三维图形',
      messages: [
        '计算机图形学(Computer Graphics，简称CG)是一种使用数学算法' +
        '将二维或三维图形转化为计算机显示器的栅格形式的科学',
        '简单地说，计算机图形学的' +
        '主要研究内容就是研究如何在计算机中表示图形、',
        '以及利用计算机进行图形的计算、' +
        '处理和显示的相关原理与算法。'
      ]
    }, {
      id: 7,
      name: '视角变换',
      messages: [
        '计算机图形学(Computer Graphics，简称CG)是一种使用数学算法' +
        '将二维或三维图形转化为计算机显示器的栅格形式的科学',
        '简单地说，计算机图形学的' +
        '主要研究内容就是研究如何在计算机中表示图形、',
        '以及利用计算机进行图形的计算、' +
        '处理和显示的相关原理与算法。'
      ]
    }, {
      id: 8,
      name: '颜色和纹理',
      messages: [
        '计算机图形学(Computer Graphics，简称CG)是一种使用数学算法' +
        '将二维或三维图形转化为计算机显示器的栅格形式的科学',
        '简单地说，计算机图形学的' +
        '主要研究内容就是研究如何在计算机中表示图形、',
        '以及利用计算机进行图形的计算、' +
        '处理和显示的相关原理与算法。'
      ]
    }, {
      id: 9,
      name: '着色器语言',
      messages: [
        '计算机图形学(Computer Graphics，简称CG)是一种使用数学算法' +
        '将二维或三维图形转化为计算机显示器的栅格形式的科学',
        '简单地说，计算机图形学的' +
        '主要研究内容就是研究如何在计算机中表示图形、',
        '以及利用计算机进行图形的计算、' +
        '处理和显示的相关原理与算法。'
      ]
    }, {
      id: 10,
      name: '光照',
      messages: [
        '计算机图形学(Computer Graphics，简称CG)是一种使用数学算法' +
        '将二维或三维图形转化为计算机显示器的栅格形式的科学',
        '简单地说，计算机图形学的' +
        '主要研究内容就是研究如何在计算机中表示图形、',
        '以及利用计算机进行图形的计算、' +
        '处理和显示的相关原理与算法。'
      ]
    }, {
      id: 11,
      name: '层次模型',
      messages: [
        '计算机图形学(Computer Graphics，简称CG)是一种使用数学算法' +
        '将二维或三维图形转化为计算机显示器的栅格形式的科学',
        '简单地说，计算机图形学的' +
        '主要研究内容就是研究如何在计算机中表示图形、',
        '以及利用计算机进行图形的计算、' +
        '处理和显示的相关原理与算法。'
      ]
    }, {
      id: 12,
      name: '底层技术',
      messages: [
        '计算机图形学(Computer Graphics，简称CG)是一种使用数学算法' +
        '将二维或三维图形转化为计算机显示器的栅格形式的科学',
        '简单地说，计算机图形学的' +
        '主要研究内容就是研究如何在计算机中表示图形、',
        '以及利用计算机进行图形的计算、' +
        '处理和显示的相关原理与算法。'
      ]
    }, {
      id: 13,
      name: '高级技术',
      messages: [
        '计算机图形学(Computer Graphics，简称CG)是一种使用数学算法' +
        '将二维或三维图形转化为计算机显示器的栅格形式的科学',
        '简单地说，计算机图形学的' +
        '主要研究内容就是研究如何在计算机中表示图形、',
        '以及利用计算机进行图形的计算、' +
        '处理和显示的相关原理与算法。'
      ]
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private modalService: NzModalService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id');
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
