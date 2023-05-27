import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Permission } from 'src/app/enum/permission.enum';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CookiesEnum } from 'src/app/enum/cookies.enum';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  loading:boolean = true;
  permissions:Array<string> = [''];
  PermissionEnum:any = Permission;
  CurrentRoute:string = '';

  constructor(
    private readonly LoginService: LoginService,
    private readonly Router: Router,
    private CookieService: CookieService,
  ){ }

  ngOnInit(): void {
    this.loading = false,
    this.LoginService.currentPermissions.subscribe(state => this.permissions = state);
    this.handleActiveRoute();
  }

  handleActiveRoute(): void {
    setTimeout(() => {
      this.CurrentRoute = this.Router.url;
    }, 50);
  }

  onCloseSession(): void {
    //
    this.CookieService.delete(CookiesEnum.Session);
    this.Router.navigate(['/login']);
    this.LoginService.changeLoging(false);
  }

}