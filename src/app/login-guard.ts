import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './service/auth.service';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.hasLogin()) {
      if (state.url === '/login' || state.url === '/register') {
        this.router.navigateByUrl(this.authService.redirectUrl);
        return false;
      }
      return true;
    } else if (state.url === '/login' || state.url === '/register') {
      return true;
    } else {
      this.router.navigateByUrl(this.authService.loginUrl);
      return false;
    }
  }
}
