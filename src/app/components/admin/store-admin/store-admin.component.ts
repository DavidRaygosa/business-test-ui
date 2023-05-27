import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faPlus, faTextHeight, faLocationDot, faPencil, faXmark, faBoxArchive } from '@fortawesome/free-solid-svg-icons';
import { Permission } from 'src/app/enum/permission.enum';
import { IError, IStore } from 'src/app/interfaces/api.business.interfaces';
import { ApiBusinessService } from 'src/app/services/api.business.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-store-admin',
  templateUrl: './store-admin.component.html',
  styleUrls: ['./store-admin.component.css']
})
export class StoreAdminComponent implements OnInit {
  // ICONS
  faPlus = faPlus;
  faTextHeight = faTextHeight;
  faLocationDot = faLocationDot;
  faPencil = faPencil;
  faXmark = faXmark;
  faBoxArchive = faBoxArchive;

  // ACTIONS
  permissions:Array<string> = [''];
  PermissionEnum:any = Permission;
  error:boolean = false;
  errorMessage:string = '';
  alert:boolean = false;
  alertMessage:string = '';
  loadingStores:boolean = false;
  creatingStore:boolean = false;
  updatingStore:boolean = false;
  deletingStore:boolean = false;

  // FORMS
  createStoreForm = new FormGroup({
    branch: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(256)
    ])),
    direction: new FormControl('', Validators.compose([
      Validators.minLength(3),
      Validators.maxLength(256)
    ])),
  });
  editStoreForm = new FormGroup({
    id: new FormControl('', Validators.compose([
      Validators.required
    ])),
    branch: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(256)
    ])),
    direction: new FormControl('', Validators.compose([
      Validators.minLength(3),
      Validators.maxLength(256)
    ])),
  });
  deleteStoreForm = new FormGroup({
    id: new FormControl('', Validators.compose([
      Validators.required
    ])),
    branch: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(256)
    ])),
    direction: new FormControl('', Validators.compose([
      Validators.minLength(3),
      Validators.maxLength(256)
    ])),
  });

  // DOM ELEMENTS
  @ViewChild('newStoreButton') newStoreButton:ElementRef | undefined;
  @ViewChild('editStoreButton') editStoreButton:ElementRef | undefined;
  @ViewChild('deleteStoreButton') deleteStoreButton:ElementRef | undefined;

  // STORES
  Stores:Array<IStore> = [];

  constructor(
    private readonly LoginService: LoginService,
    private readonly Router: Router,
    private readonly ApiBusinessService: ApiBusinessService
  ){ }

  ngOnInit(): void {
    //
    this.LoginService.currentPermissions.subscribe(state => {
      this.permissions = state;
      if(this.permissions.length > 1 && !this.permissions.includes(Permission.Store_Admin))
        this.Router.navigate(['']);
    }); 
    this.getStores(); 
  }

  getStores(): void {
    //
    this.loadingStores = true;
    this.hideError();
    this.ApiBusinessService.getStores().subscribe({
      next: (n) => this.handleNextStores(n),
      error: (e) => this.handleErrorStores(e)
    });
  }

  handleNextStores(n:Array<IStore>): void {
    //
    this.Stores = n;
    this.loadingStores = false;
  }
  
  handleErrorStores(e:HttpErrorResponse): void {
    //
    this.loadingStores = false;
    this.showErrorAlert(e.error);
  }

  //---------------------------------------------------------------> CREATE STORE

  onShowCreateStoreModal(): void {
    //
    this.newStoreButton?.nativeElement.click();
  }

  onNewStoreSubmit(): void {
    //
    if(
      !this.createStoreForm.value.branch
    )
      return;

    const StorePayload:IStore = {
      branch: this.createStoreForm.value.branch,
      direction: (this.createStoreForm.value.direction as string)
    };

    this.creatingStore = true;
    this.hideAlert();
    this.hideError();
    this.ApiBusinessService.createStore(StorePayload).subscribe({
      next: (n) => this.handleNextCreateStore(n),
      error: (e) => this.handleErrorCreateStore(e)
    });
  }

  handleNextCreateStore(n:any): void {
    //
    this.creatingStore = false;
    this.createStoreForm.reset();
    this.newStoreButton?.nativeElement.click();
    this.showAlert('¡Sucursal creada exitosamente!');
    this.getStores();
  }

  handleErrorCreateStore(e:HttpErrorResponse): void {
    //
    this.creatingStore = false;
    this.showErrorAlert(e.error);
  }

  //---------------------------------------------------------------> END CREATE STORE

  //---------------------------------------------------------------> UPDATE STORE

  onShowUpdateModal(Store:IStore): void {
    //
    if(!Store)
      return;

    this.editStoreForm.controls.id.setValue((Store.id as number).toString());
    this.editStoreForm.controls.branch.setValue((Store.branch as string));
    this.editStoreForm.controls.direction.setValue((Store.direction as string));

    this.editStoreButton?.nativeElement.click();
  }

  onUpdateStore(): void {
    //
    if(
      !this.editStoreForm.value.branch ||
      !this.editStoreForm.value.id
    )
      return;

    const StorePayload:IStore = {
      id: Number(this.editStoreForm.value.id),
      branch: this.editStoreForm.value.branch,
      direction: (this.editStoreForm.value.direction as string)
    };

    this.updatingStore = true;
    this.hideAlert();
    this.hideError();
    this.ApiBusinessService.updateStore(StorePayload).subscribe({
      next: (n) => this.handleNextUpdateStore(n),
      error: (e) => this.handleErrorUpdateStore(e)
    });
  }

  handleNextUpdateStore(n:any): void {
    //
    this.updatingStore = false;
    this.editStoreForm.reset();
    this.editStoreButton?.nativeElement.click();
    this.showAlert('¡Sucursal actualizada exitosamente!');
    this.getStores();
  }

  handleErrorUpdateStore(e:any): void {
    //
    this.updatingStore = false;
    this.showErrorAlert(e.error);
  }

  //---------------------------------------------------------------> END UPDATE STORE

  //---------------------------------------------------------------> DELETE STORE
  
  onShowDeleteModal(Store:IStore): void {
    //
    if(!Store)
      return;

    this.deleteStoreForm.controls.id.setValue((Store.id as number).toString());
    this.deleteStoreForm.controls.branch.setValue((Store.branch as string));
    this.deleteStoreForm.controls.direction.setValue((Store.direction as string));

    this.deleteStoreButton?.nativeElement.click();
  }

  onDeleteStore(): void {
    //
    if(
      !this.deleteStoreForm.value.branch ||
      !this.deleteStoreForm.value.id
    )
      return;

    const StorePayload:IStore = {
      id: Number(this.deleteStoreForm.value.id),
      branch: this.deleteStoreForm.value.branch,
      direction: (this.deleteStoreForm.value.direction as string)
    };

    this.deletingStore = true;
    this.hideAlert();
    this.hideError();
    this.ApiBusinessService.deleteStore(StorePayload).subscribe({
      next: (n) => this.handleNextDeleteStore(n),
      error: (e) => this.handleErrorDeleteStore(e)
    });
  }

  handleNextDeleteStore(n:any): void {
    //
    this.deletingStore = false;
    this.deleteStoreForm.reset();
    this.deleteStoreButton?.nativeElement.click();
    this.showAlert('¡Sucursal eliminada exitosamente!');
    this.getStores();
  }

  handleErrorDeleteStore(e:any): void {
    //
    this.deletingStore = false;
    this.showErrorAlert(e.error);
  }

  //---------------------------------------------------------------> END DELETE STORE

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