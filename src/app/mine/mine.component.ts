import {Component, OnInit} from '@angular/core';
import {User} from '../user';
import {UserService} from '../user.service';
import {delay, timeout} from 'rxjs/operators';
import {NzNotificationService} from 'ng-zorro-antd';
import {NzButtonComponent} from 'ng-zorro-antd';

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

  constructor(private userService: UserService, private notification: NzNotificationService) {
    this.notification.config({
      nzPlacement: 'bottomRight'
    });
  }

  ngOnInit() {
    this.loading = true;
    this.userService.getUserInfo()
      .subscribe(
        (user: User) => {
          this.user = user;
          this.loading = false;
        },
        (msg: string) => {
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
          this.notification.error('应用更改失败', '网络原因或服务器内部错误，请重新尝试或者登出后重新登录');
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

  makeEditable(inputElement: HTMLInputElement, buttonElement: NzButtonComponent) {
    // we must do it in setTimeout() because of the limitation of Angular
    inputElement.readOnly = false;
    inputElement.focus();
    buttonElement.el.hidden = true;
  }
}
