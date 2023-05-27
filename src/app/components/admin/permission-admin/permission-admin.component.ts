import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faPencil, faXmark, faPlus, faTextHeight } from '@fortawesome/free-solid-svg-icons';
import { Permission } from 'src/app/enum/permission.enum';
import { IError, IPermission } from 'src/app/interfaces/api.business.interfaces';
import { ApiBusinessService } from 'src/app/services/api.business.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-permission-admin',
  templateUrl: './permission-admin.component.html',
  styleUrls: ['./permission-admin.component.css']
})
export class PermissionAdminComponent implements OnInit {

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
  loadingPermissions:boolean = true;
  creatingPermission:boolean = false;
  updatingPermission:boolean = false;
  deletingPermission:boolean = false;

  // DATA
  Permissions:Array<IPermission> = [];
  handlePermission:IPermission | undefined;

  // DOM ELEMENTS
  @ViewChild('newPermissionButton') newPermissionButton:ElementRef | undefined;
  @ViewChild('editPermissionButton') editPermissionButton:ElementRef | undefined;
  @ViewChild('deletePermissionButton') deletePermissionButton:ElementRef | undefined;

  // FORMS
  newPermissionForm = new FormGroup({
    name: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(32)
    ]))
  });
  editPermissionForm = new FormGroup({
    id: new FormControl('', Validators.compose([
      Validators.required
    ])),
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
    this.loadingPermissions = false;
  }

  handleErrorPermission(e:HttpErrorResponse): void {
    //
    this.loadingPermissions = false;
    this.showErrorAlert(e.error);
  }

  // -------------------------------------------------------- END PERMISSIONS

  // -------------------------------------------------------- CREATE PERMISSION

  onShowCreateModal(): void {
    //
    this.newPermissionButton?.nativeElement.click();
  }

  onCreatePermission(): void {
    //
    if(!this.newPermissionForm.value.name)
      return;

    const PermissionPayload:IPermission = {
      name: this.newPermissionForm.value.name
    };

    this.creatingPermission = true;
    this.hideAlert();
    this.hideError();
    this.ApiBusinessService.createPermission(PermissionPayload).subscribe({
      next: (n) => this.handleNextCreatePermission(n),
      error: (e) => this.handleErrorCreatePermission(e)
    });
  }

  handleNextCreatePermission(n:any): void {
    //
    this.creatingPermission = false;
    this.newPermissionForm.reset();
    this.newPermissionButton?.nativeElement.click();
    this.showAlert('¡Permiso creado exitosamente!');
    this.getPermissions();
  }

  handleErrorCreatePermission(e:HttpErrorResponse): void {
    //
    this.creatingPermission = false;
    this.showErrorAlert(e.error);
  }

  // -------------------------------------------------------- END CREATE PERMISSION

  // -------------------------------------------------------- UPDATE PERMISSION

  onShowUpdateModal(Permission:IPermission): void {
    //
    if(!Permission)
      return;

    this.editPermissionForm.controls.id.setValue(Number(Permission.id).toString());
    this.editPermissionForm.controls.name.setValue(Permission.name);

    this.editPermissionButton?.nativeElement.click();
  }

  onUpdatePermission(): void {
    //
    if(!this.editPermissionForm.value.id || !this.editPermissionForm.value.name)
      return;

    const PermissionPayload:IPermission = {
      name: this.editPermissionForm.value.name
    };

    this.updatingPermission = true;
    this.hideAlert();
    this.hideError();
    this.ApiBusinessService.updatePermission(Number(this.editPermissionForm.value.id), PermissionPayload).subscribe({
      next: (n) => this.handleNextUpdatePermission(n),
      error: (e) => this.hanldeErrorUpdatePermission(e)
    });
  }

  handleNextUpdatePermission(n:any): void {
    //
    this.updatingPermission = false;
    this.editPermissionForm.reset();
    this.editPermissionButton?.nativeElement.click();
    this.showAlert('¡Permiso actualizado exitosamente!');
    this.getPermissions();
  }

  hanldeErrorUpdatePermission(e:HttpErrorResponse): void {
    //
    this.updatingPermission = false;
    this.showErrorAlert(e.error);
  }

  // -------------------------------------------------------- END UPDATE PERMISSION

  // -------------------------------------------------------- DELETE PERMISSION

  onShowDeleteModal(Permission:IPermission): void {
    //
    if(!Permission)
      return;

    this.handlePermission = Permission;
    this.deletePermissionButton?.nativeElement.click();
  }

  onDeletePermission(): void {
    //
    if(!this.handlePermission || !this.handlePermission.id)
      return;

    this.deletingPermission = true;
    this.hideAlert();
    this.hideError();
    this.ApiBusinessService.deletePermission(Number(this.handlePermission.id)).subscribe({
      next: (n) => this.handleNextDeletePermission(n),
      error: (e) => this.handleErrorDeletePermission(e)
    });
  }

  handleNextDeletePermission(n:any): void {
    //
    this.deletingPermission = false;
    this.handlePermission = undefined;
    this.deletePermissionButton?.nativeElement.click();
    this.showAlert('¡Permiso eliminado exitosamente!');
    this.getPermissions();
  }

  handleErrorDeletePermission(e:HttpErrorResponse): void {
    //
    this.deletingPermission = false;
    this.showErrorAlert(e.error);
  }
  
  // -------------------------------------------------------- END DELETE PERMISSION

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