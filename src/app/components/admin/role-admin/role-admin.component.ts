import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faPencil, faXmark, faPlus, faTextHeight } from '@fortawesome/free-solid-svg-icons';
import { Permission } from 'src/app/enum/permission.enum';
import { IError, IPermission, IRole } from 'src/app/interfaces/api.business.interfaces';
import { ApiBusinessService } from 'src/app/services/api.business.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-role-admin',
  templateUrl: './role-admin.component.html',
  styleUrls: ['./role-admin.component.css']
})
export class RoleAdminComponent implements OnInit {

  // ICONS
  faPencil = faPencil;
  faXmark = faXmark;
  faPlus = faPlus;
  faTextHeight = faTextHeight;

  // ACTIONS
  permissions:Array<string> = [''];
  PermissionEnum:any = Permission;
  error:boolean = false;
  errorMessage:string = '';
  alert:boolean = false;
  alertMessage:string = '';
  loadingRoles:boolean = true;
  loadingPermissions:boolean = false;
  creatingRole:boolean = false;
  updatingRole:boolean = false;
  deletingRole:boolean = false;

  // DATA
  Roles:Array<IRole> = [];
  Permissions:Array<IPermission> = [];
  PermissionsNames:Array<string> = [];
  handleRole:IRole | undefined

  // DOM ELEMENTS
  @ViewChild('newRoleButton') newRoleButton:ElementRef | undefined;
  @ViewChild('editRoleButton') editRoleButton:ElementRef | undefined;
  @ViewChild('deleteRoleButton') deleteRoleButton:ElementRef | undefined;

  // FORMS
  newRoleForm = new FormGroup({
    name: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(32)
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
    this.getRoles();
    this.getPermissions();
  }

  // -------------------------------------------------------- GET PERMISSIONS

  getPermissions(): void {
    //
    this.loadingPermissions = true;
    this.hideError();
    this.ApiBusinessService.getPermissions().subscribe({
      next: (n) => this.handleNextPermission(n),
      error: (e) => this.handleErrorPermission(e)
    });
  }

  handleNextPermission(n:Array<IPermission>): void {
    //
    this.Permissions = n;
    this.Permissions.map(p => this.PermissionsNames.push((p.name as string)));
    this.loadingPermissions = false;
  }

  handleErrorPermission(e:HttpErrorResponse): void {
    //
    this.loadingPermissions = false;
    this.showErrorAlert(e.error);
  }

  // -------------------------------------------------------- END PERMISSIONS

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

  // -------------------------------------------------------- CREATE ROLE

  onShowCreateModal(): void {
    //
    this.newRoleButton?.nativeElement.click();
  }

  onCreateRole(): void {
    //
    if(!this.newRoleForm.value.name)
      return;

    const RolePayload:IRole = {
      name: this.newRoleForm.value.name
    };

    this.creatingRole = true;
    this.hideAlert();
    this.hideError();
    this.ApiBusinessService.createRole(RolePayload).subscribe({
      next: (n) => this.handleNextCreatRole(n),
      error: (e) => this.handleErrorCreatRole(e)
    });
  }

  handleNextCreatRole(n:any): void {
    //
    this.creatingRole = false;
    this.newRoleForm.reset();
    this.newRoleButton?.nativeElement.click();
    this.showAlert('¡Role creado exitosamente!');
    this.getRoles();
  }

  handleErrorCreatRole(e:HttpErrorResponse): void {
    //
    this.creatingRole = false;
    this.showErrorAlert(e.error);
  }

  // -------------------------------------------------------- END CREATE ROLE

  // -------------------------------------------------------- UPDATE ROLE

  onShowEditRoleModal(Role:IRole): void {
    //
    if(!Role)
      return;

    this.handleRole = Role;
    this.editRoleButton?.nativeElement.click();
  }

  onChangePermission(e:Event): void {
    //
    if(!e || !e.target)
      return;

    const InputElement:HTMLInputElement = (e.target as HTMLInputElement);

    if(!InputElement.checked && this.handleRole)
      this.handleRole.permissions = this.handleRole?.permissions?.filter(r => r != InputElement.value);
    
    if(InputElement.checked && this.handleRole)
      this.handleRole.permissions?.push(InputElement.value);
  }

  onUpdateRole(): void {
    //
    if(!this.handleRole)
      return;

    const RolePayload:IRole = {
      permissions: this.handleRole.permissions
    };

    this.updatingRole = true;
    this.hideAlert();
    this.hideError();
    this.ApiBusinessService.updateRole(Number(this.handleRole.id), RolePayload).subscribe({
      next: (n) => this.handleNextUpdateRole(n),
      error: (e) => this.handleErrorUpdateRole(e)
    });
  }

  handleNextUpdateRole(n:any): void {
    //
    this.updatingRole = false;
    this.handleRole = undefined;
    this.editRoleButton?.nativeElement.click();
    this.showAlert('¡Role actualizado exitosamente!');
    this.getRoles();
  }

  handleErrorUpdateRole(e:HttpErrorResponse): void {
    //
    this.updatingRole = false;
    this.showErrorAlert(e.error);
  }

  // -------------------------------------------------------- END UPDATE ROLE

  // -------------------------------------------------------- DELETE ROLE

  onShowDeleteModal(Role:IRole): void {
    //
    if(!Role)
      return;

    this.handleRole = Role;
    this.deleteRoleButton?.nativeElement.click(); 
  }

  onDeleteRole(): void {
    //
    if(!this.handleRole)
      return;

    this.deletingRole = true;
    this.hideAlert();
    this.hideError();
    this.ApiBusinessService.deleteRole(Number(this.handleRole.id)).subscribe({
      next: (n) => this.handleNextDeleteRole(n),
      error: (e) => this.handleErrorDeleteRole(e)
    });
  }

  handleNextDeleteRole(n:any): void {
    //
    this.deletingRole = false;
    this.handleRole = undefined;
    this.deleteRoleButton?.nativeElement.click();
    this.showAlert('¡Role eliminado exitosamente!');
    this.getRoles();
  }

  handleErrorDeleteRole(e:HttpErrorResponse): void {
    //
    this.deletingRole = false;
    this.showErrorAlert(e.error);
  }

  // -------------------------------------------------------- END DELETE ROLE

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