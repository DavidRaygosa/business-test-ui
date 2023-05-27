import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faPencil, faXmark, faLocationDot, faTextHeight, faUser, faKey } from '@fortawesome/free-solid-svg-icons';
import { Permission } from 'src/app/enum/permission.enum';
import { IClient, IError, IRole } from 'src/app/interfaces/api.business.interfaces';
import { ApiBusinessService } from 'src/app/services/api.business.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-user-admin',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.css']
})
export class UserAdminComponent implements OnInit {

  // ICONS
  faPencil = faPencil;
  faXmark = faXmark;
  faLocationDot = faLocationDot;
  faTextHeight = faTextHeight;
  faUser = faUser;
  faKey = faKey;

  // ACTIONS
  permissions:Array<string> = [''];
  PermissionEnum:any = Permission;
  error:boolean = false;
  errorMessage:string = '';
  alert:boolean = false;
  alertMessage:string = '';
  loadingUsers:boolean = true;
  loadingRoles:boolean = false;
  updatingUser:boolean = false;
  deletingUser:boolean = false;

  // DATA
  Clients:Array<IClient> = [];
  Roles:Array<IRole> = [];
  handlClient:IClient | undefined;

  // DOM ELEMENTS
  @ViewChild('editUserButton') editUserButton:ElementRef | undefined;
  @ViewChild('deleteUserButton') deleteUserButton:ElementRef | undefined;

  // FORMS
  editUserForm = new FormGroup({
    id: new FormControl('', Validators.compose([
      Validators.required
    ])),
    name: new FormControl('', Validators.compose([
      Validators.required
    ])),
    lastname: new FormControl('', Validators.compose([
      Validators.required
    ])),
    direction: new FormControl('', Validators.compose([
    ])),
    roleId: new FormControl('', Validators.compose([
      Validators.required
    ]))
  });

  constructor(
    private readonly LoginService: LoginService,
    private readonly Router: Router,
    private readonly ApiBusinessService: ApiBusinessService
  ){ }

  ngOnInit(): void {
    this.LoginService.currentPermissions.subscribe(state => {
      this.permissions = state;
      if(this.permissions.length > 1 && !this.permissions.includes(Permission.Store_Admin))
        this.Router.navigate(['']);
    });
    this.getUsers();
    this.getRoles();
  }

  // -------------------------------------------------------- GET ROLES

  getRoles(): void {
    //
    this.loadingRoles = true;
    this.hideError();
    this.ApiBusinessService.getRoles().subscribe({
      next: (n) => this.handleNextRoles(n),
      error: (e) => this.handleErrorRole(e)
    });
  }

  handleNextRoles(n:Array<IRole>): void {
    //
    this.Roles = n;
    this.loadingRoles = false;
  }

  handleErrorRole(e:HttpErrorResponse): void {
    //
    this.loadingRoles = false;
    this.showErrorAlert(e.error);
  }

  // -------------------------------------------------------- END GET ROLES

  // -------------------------------------------------------- GET USERS

  getUsers(): void {
    //
    this.loadingUsers = true;
    this.hideError();
    this.ApiBusinessService.getUsers().subscribe({
      next: (n) => this.handleNextUser(n),
      error: (e) => this.handleErrorUser(e)
    });
  }

  handleNextUser(n:Array<IClient>): void {
    //
    this.Clients = n;
    this.loadingUsers = false;
  }

  handleErrorUser(e:HttpErrorResponse): void {
    //
    this.loadingUsers = false;
    this.showErrorAlert(e.error);
  }

  // -------------------------------------------------------- END GET USERS

  // -------------------------------------------------------- UPDATE USER

  onShowUpdateUserModel(Client:IClient): void {
    //
    if(!Client)
      return;

    this.editUserForm.controls.id.setValue(Number(Client.id).toString());
    this.editUserForm.controls.name.setValue((Client.name as string));
    this.editUserForm.controls.lastname.setValue((Client.lastname as string));
    this.editUserForm.controls.direction.setValue((Client.direction as string));
    this.editUserForm.controls.roleId.setValue(Number(Client.roleId).toString());

    this.editUserButton?.nativeElement.click();
  }

  onUpdateUser(): void {
    //
    if(!this.editUserForm.value.id)
      return;

    const ClientPayload:IClient = {
      name: (this.editUserForm.value.name as string),
      lastname: (this.editUserForm.value.name as string),
      direction: (this.editUserForm.value.direction as string),
      roleId: Number(this.editUserForm.value.roleId)
    };

    this.updatingUser = true;
    this.hideAlert();
    this.hideError();
    this.ApiBusinessService.updateUser(Number(this.editUserForm.value.id), ClientPayload).subscribe({
      next: (n) => this.handleNextUpdateUser(n),
      error: (e) => this.hanldeErrorUpdateUser(e)
    });
  }

  handleNextUpdateUser(n:any): void {
    //
    this.updatingUser = false;
    this.editUserForm.reset();
    this.editUserButton?.nativeElement.click();
    this.showAlert('¡Usuario actualizado exitosamente!');
    this.getUsers();
  }

  hanldeErrorUpdateUser(e:HttpErrorResponse): void {
    //
    this.updatingUser = false;
    this.showErrorAlert(e.error);
  }

  // -------------------------------------------------------- END UPDATE USER

  // -------------------------------------------------------- DELETE USER

  onShowDeleteUserModal(Client:IClient): void {
    //
    if(!Client)
      return;

    this.handlClient = Client;
    this.deleteUserButton?.nativeElement.click();
  }

  onDeleteUser(): void {
    //
    if(!this.handlClient)
      return;
    
    this.deletingUser = true;
    this.hideAlert();
    this.hideError();
    this.ApiBusinessService.deleteUser(Number(this.handlClient.id)).subscribe({
      next: (n) => this.handleNextDeleteUser(n),
      error: (e) => this.handleErrorDeleteUser(e)
    });
  }

  handleNextDeleteUser(n:any): void {
    //
    this.deletingUser = false;
    this.handlClient = undefined;
    this.deleteUserButton?.nativeElement.click();
    this.showAlert('¡Usuario eliminado exitosamente!');
    this.getUsers();
  }

  handleErrorDeleteUser(e:HttpErrorResponse): void {
    //
    this.deletingUser = false;
    this.showErrorAlert(e.error);
  }

  // -------------------------------------------------------- END DELETE USER

  hideAlert(){
    this.alert = false;
    this.alertMessage = '';
  }

  showAlert(Message:string){
    this.alert = true;
    this.alertMessage = Message;
    setTimeout(() => {
      this.hideAlert();
    }, 5000);
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