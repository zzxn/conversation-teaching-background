import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {debounceTime} from 'rxjs/operators';
import {AuthService} from './service/auth.service';
import {fromEvent} from 'rxjs';
import {NzModalService} from 'ng-zorro-antd';
import {UserService} from './service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isCollapse = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private modalService: NzModalService,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    fromEvent(window, 'resize')
      .pipe(debounceTime(10))
      .subscribe((event) => {
        this.isCollapse = window.innerWidth < 576;
      });
  }

  confirmLogout() {
    this.modalService.confirm({
      nzTitle: '<i>确认登出吗？</i>',
      nzContent: '<b>登出后会跳转到登录界面，需要重新登录</b>',
      nzOnOk: () => this.userService.logoutAndRedirect()
    });
  }
}
