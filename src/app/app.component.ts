import { Component, OnInit } from '@angular/core';
import { LoginService } from './services/login.service';
import { ApiBusinessService } from './services/api.business.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IError } from './interfaces/api.business.interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit {
  title = 'business';
  logged:boolean = false;
  error:boolean = false;
  errorMessage:string = '';

  constructor(
    private readonly LoginService: LoginService,
    private readonly ApiBusinessService: ApiBusinessService
  ){ }

  ngOnInit(): void {
    this.LoginService.currentLoging.subscribe(state => this.handleSession(state));
  }

  handleSession(loggingState:boolean): void {
    //
    this.logged = loggingState;
    if(this.logged){
      this.hideError();
      this.ApiBusinessService.validate().subscribe({
        next: (n) => this.handleNextSession(n),
        error: (e) => this.handleErrorSession(e)
      });
    }
  }

  handleNextSession(n:Array<string>){
    //
    this.LoginService.changePermissions(n);
  }
  
  handleErrorSession(e:HttpErrorResponse){
    //
    this.LoginService.changeLoging(false);
    this.showErrorAlert(e.error);
  }

  hideError(){
    this.error = false;
    this.errorMessage = '';
  }

  showErrorAlert(Error:IError|string){
    this.error = true;
    if((<IError>Error).Message){
      const ErrorMsg:IError = (<IError>Error);
      this.errorMessage = ErrorMsg.Message || 'Unknown error';
    }
    else{
      const ErrorMsg:string = <string>Error;
      this.errorMessage = ErrorMsg || 'Unknown error';
    }
  }

}