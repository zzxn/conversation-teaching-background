import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {UserService} from '../service/user.service';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-mine-modify',
  templateUrl: './mine-modify.component.html',
  styleUrls: ['./mine-modify.component.css']
})
export class MineModifyComponent implements OnInit {
  isCollapsed = false;
  applying = false;
  applyFinish = true;
  applyButtonIconType = 'reload';
  applyButtonType = 'danger';
  validateForm: FormGroup;
  validatePasswordSubject = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private notification: NzNotificationService,
    private modalService: NzModalService
  ) {
    this.validateForm = this.fb.group({
      oldPassword: ['', []],
      password: ['', [this.passwordValidator]],
      confirm: ['', [this.confirmValidator]]
    });
    this.notification.config({
      nzPlacement: 'bottomRight',
      nzMaxStack: 2
    });
  }

  ngOnInit(): void {
    this.validatePasswordSubject
      .pipe(
        tap((_) => this.validateForm.controls.oldPassword.markAsPending()),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe(
        (password: string) => {
          console.log(this.validateForm.controls.oldPassword.status);
          this.validOldPassword(password);
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

  submitForm = ($event: any, value: any) => {
    $event.preventDefault();
    if (!this.applyFinish) {
      return;
    }
    this.applyFinish = false;
    this.applying = true;
    // tslint:disable-next-line:forin
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    this.userService.updatePassword(this.validateForm.controls.password.value).subscribe(
      () => {
        console.log('success update password');
        this.applying = false;
        this.applyButtonIconType = 'check-circle';
        this.applyButtonType = 'default';
        setTimeout(() => {
          this.applyButtonIconType = 'reload';
          this.applyButtonType = 'danger';
          this.applyFinish = true;
        }, 2000);
      },
      (error) => {
        if (error.hasOwnProperty('error') && error.error.code === 'auth:bad-token') {
          this.notification.error('身份令牌失效', '请登出后重新登录');
        } else {
          this.notification.error('网络异常', '联系服务器出错');
        }
        console.log(error);
        this.applying = false;
        this.applyButtonIconType = 'close-circle';
        this.applyButtonType = 'danger';
        setTimeout(() => {
          this.applyButtonIconType = 'reload';
          this.applyButtonType = 'danger';
          this.applyFinish = true;
        }, 2000);
      }
    );
    console.log(value);
  };

  sendValidateOldPassword(password: string): void {
    this.validatePasswordSubject.next(password);
  }

  validOldPassword(password: string) {
    this.userService.validPassword(password).subscribe(
      () => {
        this.validateForm.controls.oldPassword.updateValueAndValidity();
        console.log('success');
      },

      (error) => {
        if (error.hasOwnProperty('error') && error.error.code === 'auth:bad-pass') {
          console.log(error);
          this.validateForm.controls.oldPassword.setErrors({
            wrong: true
          });
        } else {
          this.validateForm.controls.oldPassword.setErrors({
            netError: true
          });
        }
      }
    );
  }

  validateConfirmPassword(): void {
    setTimeout(() => this.validateForm.controls.confirm.updateValueAndValidity());
  }

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {required: true};
    } else if (control.value !== this.validateForm.controls.password.value) {
      return {confirm: true, error: true};
    }
    return {};
  };

  passwordValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {required: true};
    } else if (control.value.toString().length < 6) {
      return {short: true};
    } else if (control.value.toString().length > 20) {
      return {long: true};
    } else if (/^[0-9]+$/.test(control.value.toString())) {
      return {onlyNumber: true};
    }
    return {};
  };
}
