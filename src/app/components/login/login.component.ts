import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faUser, faKey, faEye, faEyeSlash, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { CookieService } from 'ngx-cookie-service';
import { IError, ILogin, IRegister } from 'src/app/interfaces/api.business.interfaces';
import { ApiBusinessService } from 'src/app/services/api.business.service';
import * as Aos from 'aos';
import { CookiesEnum } from 'src/app/enum/cookies.enum';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // ICONS
  faUser = faUser;
  faKey = faKey;
  faLocationDot = faLocationDot;
  inputToggle = faEye

  // ACTIONS
  error:boolean = false;
  errorMessage:string = '';
  registerPanel:boolean = false;
  logging:boolean = false;
  registering:boolean = false;

  // FORMS
  loginForm = new FormGroup({
    username: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(3)
    ])),
    password: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(3)
    ]))
  });
  registerForm = new FormGroup({
    username: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(52)
    ])),
    password: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(52)
    ])),
    name: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(52)
    ])),
    lastname: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(52)
    ])),
    direction: new FormControl('', Validators.compose([
      Validators.minLength(5),
      Validators.maxLength(256)
    ])),
  });

  constructor(
    private readonly ApiBusinessService: ApiBusinessService,
    private readonly CookieService: CookieService,
    private readonly Router: Router,
    private readonly LoginService: LoginService
  ){ }

  ngOnInit(): void {
    Aos.init();
  }

  //---------------------------------------------------------------> LOGIN

  onLoginSubmit(){
    //
    if(!this.loginForm.value.password || !this.loginForm.value.username)
      return;

    this.logging = true;
    this.hideError();
    const LoginPayload:ILogin = {
      userName: this.loginForm.value.username,
      password: this.loginForm.value.password
    };
    
    this.ApiBusinessService.login(LoginPayload).subscribe({
      next: (n) => this.handleNextLogin(n),
      error: (e) => this.handleErrorLogin(e)
    });
  }

  handleNextLogin(n:string){
    this.logging = false;
    this.CookieService.set(CookiesEnum.Session, n);
    this.LoginService.changeLoging(true);
    this.Router.navigate(['']);
  }

  handleErrorLogin(e:HttpErrorResponse){
    this.logging = false;
    this.showErrorAlert(e.error);
  }

  //---------------------------------------------------------------> END LOGIN

  //---------------------------------------------------------------> REGISTER
  onRegisterSubmit(){
    //
    if(
      !this.registerForm.value.username ||
      !this.registerForm.value.password ||
      !this.registerForm.value.name ||
      !this.registerForm.value.lastname
    )
      return;

    this.registering = true;
    this.hideError();
    const RegisterPayload:IRegister = {
      username: this.registerForm.value.username,
      password: this.registerForm.value.password,
      name: this.registerForm.value.name,
      lastname: this.registerForm.value.lastname,
      direction: this.registerForm.value.direction || ''
    };

    this.ApiBusinessService.register(RegisterPayload).subscribe({
      next: (n) => this.handleNextRegister(n, (this.registerForm.value.username as string), (this.registerForm.value.password as string)),
      error: (e) => this.handleErrorRegister(e)
    });
  }

  handleNextRegister(n:any, username:string, password:string){
    //
    this.registering = false;
    const LoginPayload:ILogin = {
      userName: username,
      password: password
    };
    
    this.ApiBusinessService.login(LoginPayload).subscribe({
      next: (n) => this.handleNextLogin(n),
      error: (e) => this.handleErrorLogin(e)
    });
  }

  handleErrorRegister(e:HttpErrorResponse){
    this.registering = false;
    this.showErrorAlert(e.error);
  }

  //---------------------------------------------------------------> END REGISTER
  
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

  onTogglePasswordView(inputElement:HTMLInputElement){
    //
    if(!inputElement)
      return;

    if(inputElement.type == 'password'){
      this.inputToggle = faEyeSlash;
      inputElement.type = 'text';
      return;
    }

    if(inputElement.type == 'text'){
      this.inputToggle = faEye;
      inputElement.type = 'password';
      return;
    }
  }

  onClickRegister(){
    this.registerPanel = true;
  }

  onClickLogin(){
    this.registerPanel = false;
  }
}