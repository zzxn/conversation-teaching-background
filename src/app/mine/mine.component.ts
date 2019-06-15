import {Component, OnInit} from '@angular/core';
import {User} from '../user';
import {UserService} from '../user.service';
import {delay, timeout} from 'rxjs/operators';
import {NzModalService, NzNotificationService, UploadFile, UploadXHRArgs} from 'ng-zorro-antd';
import {NzButtonComponent} from 'ng-zorro-antd';
import {Observable, Observer, Subscription} from 'rxjs';
import {until} from 'selenium-webdriver';
import urlContains = until.urlContains;

@Component({
  selector: 'app-mine',
  templateUrl: './mine.component.html',
  styleUrls: ['./mine.component.css']
})
export class MineComponent implements OnInit {
  collapsed = false;
  loading = false;
  user: User;
  applying = false;
  applyFinish = true;
  applyButtonIconType = 'reload';
  applyButtonType = 'primary';
  avatarLoading = false;
  avatarUrl: string;

  constructor(
    private userService: UserService,
    private notification: NzNotificationService,
    private modalService: NzModalService) {
    this.notification.config({
      nzPlacement: 'bottomRight'
    }
    );
  }

  ngOnInit() {
    this.loading = true;
    this.userService.getUserInfo()
      .subscribe(
        (user: User) => {
          this.user = user;
          this.avatarUrl = user.headSculpture + '?s=' + Math.random();
          console.log(user);
          this.loading = false;
        },
        (msg: string) => {
          this.modalService.error({
            nzTitle: '<i>网络异常或服务器错误</i>',
            nzContent: '<b>请刷新重试或尝试重新登录</b>'
          });
          console.log(msg);
        }
      );
  }

  applyModify() {
    // console.log(this.user);
    if (!this.applyFinish) {
      return;
    }
    this.applyFinish = false;
    this.applying = true;
    this.userService.updateUser(this.user)
      .subscribe(
        () => {
          console.log('success modify');
          this.applying = false;
          this.applyButtonIconType = 'check-circle';
          this.applyButtonType = 'default';
          setTimeout(() => {
            this.applyButtonIconType = 'reload';
            this.applyButtonType = 'primary';
            this.applyFinish = true;
          }, 2000);
        },
        (errorMsg) => {
          this.notification.error('应用更改失败', '网络原因或服务器内部错误，请修复网络后重试或重新登录');
          console.log(errorMsg);
          this.applying = false;
          this.applyButtonIconType = 'close-circle';
          this.applyButtonType = 'danger';
          setTimeout(() => {
            this.applyButtonIconType = 'reload';
            this.applyButtonType = 'primary';
            this.applyFinish = true;
          }, 2000);
        }
      );
  }

  validateNickname(nickname: string) {
    return nickname.length <= 20;
  }

  validateEmail(email: string) {
    const reg = /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,})$/;
    return reg.test(email);
  }

  makeEditable(inputElement: HTMLInputElement, buttonElement: NzButtonComponent) {
    // we must do it in setTimeout() because of the limitation of Angular
    inputElement.readOnly = false;
    inputElement.focus();
    buttonElement.el.hidden = true;
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
        this.avatarLoading = true;
        break;
      case 'done':
        // Get this url from response in real world.
        this.avatarLoading = false;
        this.user.headSculpture = 'http://adweb-image.oss-cn-shanghai.aliyuncs.com/' + this.user.uuid + '.jpg';
        this.avatarUrl = this.user.headSculpture + '?s=' + Math.random();
        this.notification.success('成功上传头像', '头像修改成功，已经生效');
        break;
      case 'error':
        this.notification.error('网络异常', '网络异常或服务器出错');
        this.avatarLoading = false;
        break;
    }
  }
}
