import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { CookiesEnum } from '../enum/cookies.enum';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class ClientGuard implements CanActivate {

  constructor(
    private readonly CookieService: CookieService,
    private readonly Router: Router,
    private readonly LoginService: LoginService
  ){ }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      //
      const cookie = this.CookieService.check(CookiesEnum.Session);

      if(cookie){
        this.LoginService.changeLoging(true);
        return true;
      }

      this.LoginService.changeLoging(false);
      this.Router.navigate(['login']);
      return false;
  }
  
}