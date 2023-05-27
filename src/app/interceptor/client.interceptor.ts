import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookiesEnum } from '../enum/cookies.enum';
import { LoginService } from '../services/login.service';

@Injectable()
export class ClientInterceptor implements HttpInterceptor {

  constructor(
    private readonly CookieService: CookieService,
    private readonly JwtHelperService: JwtHelperService,
    private readonly LoginService: LoginService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    //
    const token = this.CookieService.get(CookiesEnum.Session);
    let req = request;
    if(token){
      // TOKEN IS NOT EXPIRED
      if(!this.JwtHelperService.isTokenExpired(token)){
        req = request.clone({
          headers: new HttpHeaders({
            'Cache-Control': 'no-cache',
            'Authorization': `Bearer ${token}`
          })
        });
      }
      // TOKEN IS EXPIRED
      else {
        this.LoginService.changeLoging(false);
        this.CookieService.deleteAll();
      }
    }
    return next.handle(req);
  }
}