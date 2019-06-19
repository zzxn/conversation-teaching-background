import {Component, OnInit} from '@angular/core';
import {User} from '../entity/user';
import {UserService} from '../service/user.service';
import {NzButtonComponent, NzModalService, NzNotificationService, UploadFile} from 'ng-zorro-antd';
import {Observable, Observer} from 'rxjs';
import {until} from 'selenium-webdriver';

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

  nicknameValid = true;
  emailValid = true;

  constructor(
    private userService: UserService,
    private notification: NzNotificationService,
    private modalService: NzModalService) {
    this.notification.config({
      nzPlacement: 'bottomRight',
      nzMaxStack: 2
    });
  }

  ngOnInit() {
    this.loading = true;
    this.userService.getUserInfo()
      .subscribe(
        (user: User) => {
          this.user = user;
          this.avatarUrl = user.headSculpture + '?s=' + Math.random();
          this.loading = false;
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

  applyModify() {
    if (!this.applyFinish || !this.emailValid || !this.nicknameValid) {
      return;
    }
    this.applyFinish = false;
    this.applying = true;
    this.userService.updateUser(this.user)
      .subscribe(
        () => {
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
          if (errorMsg.hasOwnProperty('error') && errorMsg.error.code === 'auth:bad-token') {
            this.notification.error('身份令牌失效', '请登出后重新登录');
          } else {
            this.notification.error('网络异常', '联系服务器出错');
          }
          console.error(errorMsg);
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
    this.nicknameValid = nickname.length <= 20;
    return this.nicknameValid;
  }

  validateEmail(email: string) {
    const reg = /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+([a-zA-Z.]*)$/;
    this.emailValid = reg.test(email);
    return this.emailValid;
  }

  makeEditable(inputElement: HTMLInputElement, buttonElement: NzButtonComponent) {
    // we must do it in setTimeout() because of the limitation of Angular
    inputElement.readOnly = false;
    inputElement.focus();
    buttonElement.el.hidden = true;
  }

  beforeUpload = (file: File) => {
    return new Observable((observer: Observer<boolean>) => {
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
