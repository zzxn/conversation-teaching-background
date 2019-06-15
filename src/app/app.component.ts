import {Component, DoCheck, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {debounceTime, switchMap} from 'rxjs/operators';
import {AuthService} from './auth.service';
import {fromEvent} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isCollapse = false;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    fromEvent(window, 'resize')
      .pipe(debounceTime(10))
      .subscribe((event) => {
        this.isCollapse = window.innerWidth < 576;
      });
  }
}
