import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {UserService} from '../user.service';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';

@Component({
  selector: 'app-mine-modify',
  templateUrl: './mine-modify.component.html',
  styleUrls: ['./mine-modify.component.css']
})
export class MineModifyComponent {
  isCollapsed = false;
  applying = false;
  applyFinish = true;
  applyButtonIconType = 'reload';
  applyButtonType = 'danger';
  validateForm: FormGroup;

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
      nzPlacement: 'bottomRight'
    });
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
        console.log('update password error');
        this.notification.error('修改密码失败', '网络原因或服务器内部错误，请修复网络后重试或者重新登录');
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

  validateOldPassword(): void {
    this.userService.validPassword(this.validateForm.controls.oldPassword.value).subscribe(
      () => this.validateForm.controls.password.updateValueAndValidity(),
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
