import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CourseService} from '../service/course.service';
import {Course} from '../entity/course';
import {NzButtonComponent, NzNotificationService, UploadFile} from 'ng-zorro-antd';
import {Observable, Observer} from 'rxjs';

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
  imageLoading = false;
  imageUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private notification: NzNotificationService
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
        this.imageUrl = this.course.image;
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

  beforeUpload = (file: File) => {
    return new Observable((observer: Observer<boolean>) => {
      console.log(file.name);
      const isJPG = file.type === 'image/jpeg';
      if (!isJPG) {
        this.notification.error('You can only upload JPG file!', '');
        observer.complete();
        return;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.notification.error('Image must smaller than 2MB!', '');
        observer.complete();
        return;
      }
      // check height
      this.checkImageDimension(file).then(dimensionRes => {
        if (!dimensionRes) {
          this.notification.error('Image only 300x300 above', '');
          observer.complete();
          return;
        }

        observer.next(isJPG && isLt2M && dimensionRes);
        observer.complete();
      });
    });
  };

  private checkImageDimension(file: File): Promise<boolean> {
    return new Promise(resolve => {
      const img = new Image(); // create image
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        // tslint:disable-next-line:no-non-null-assertion
        window.URL.revokeObjectURL(img.src!);
        resolve(width === height && width >= 300);
      };
    });
  }

  handleChange(info: { file: UploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.imageLoading = true;
        break;
      case 'done':
        // Get this url from response in real world.
        this.imageLoading = false;
        this.course.image = 'http://adweb-image.oss-cn-shanghai.aliyuncs.com/course-image-' + this.course.id + '.jpg';
        this.imageUrl = this.course.image + '?s=' + Math.random();
        this.notification.success('成功上传课程图片', '成功上传课程图片，已经生效');
        break;
      case 'error':
        this.notification.error('网络异常', '网络异常或服务器出错');
        this.imageLoading = false;
        break;
    }
  }
}
