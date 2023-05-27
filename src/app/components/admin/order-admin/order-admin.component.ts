import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { faPencil, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Permission } from 'src/app/enum/permission.enum';
import { IError, IOrder } from 'src/app/interfaces/api.business.interfaces';
import { ApiBusinessService } from 'src/app/services/api.business.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-order-admin',
  templateUrl: './order-admin.component.html',
  styleUrls: ['./order-admin.component.css']
})
export class OrderAdminComponent implements OnInit {

  // ICONS
  faPencil = faPencil;
  faXmark = faXmark;

  // ACTIONS
  permissions:Array<string> = [''];
  PermissionEnum:any = Permission;
  error:boolean = false;
  errorMessage:string = '';
  alert:boolean = false;
  alertMessage:string = '';
  loadingOrders:boolean = true;
  deletingOrder:boolean = false;

  // DATA
  Orders:Array<IOrder> = [];
  handleOrder:IOrder | undefined;

  // DOM ELEMENTS
  @ViewChild('deleteClientItemButton') deleteClientItemButton:ElementRef | undefined;

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
    this.getOrders();
  }

  getOrders(): void {
    //
    this.loadingOrders = true;
    this.hideError();
    this.ApiBusinessService.getClientItems().subscribe({
      next: (n) => this.handleNextOrders(n),
      error: (e) => this.handleErrorOrders(e)
    });
  }

  handleNextOrders(n:Array<IOrder>): void {
    //
    this.Orders = n;
    this.loadingOrders = false;
  }

  handleErrorOrders(e:HttpErrorResponse): void {
    //
    this.loadingOrders = false;
    this.showErrorAlert(e.error);
  }

  onShowDeleteModal(Order:IOrder): void {
    //
    if(!Order)
      return;

    this.handleOrder = Order;
    this.deleteClientItemButton?.nativeElement.click();
  }

  onDeleteClientItem(): void {
    //
    if(!this.handleOrder)
      return;

    this.deletingOrder = true;
    this.hideAlert();
    this.hideError();
    this.ApiBusinessService.deleteClientItem(Number(this.handleOrder.id)).subscribe({
      next: (n) => this.handleNextDeleteClientItem(n),
      error: (e) => this.handleErrorDeleteClientItem(e)
    });
  }

  handleNextDeleteClientItem(n:any): void {
    //
    this.deletingOrder = false;
    this.handleOrder = undefined;
    this.deleteClientItemButton?.nativeElement.click();
    this.showAlert('¡Pedido eliminado exitosamente!');
    this.getOrders();
  }

  handleErrorDeleteClientItem(e:HttpErrorResponse): void {
    //
    this.deletingOrder = false;
    this.showErrorAlert(e.error);
  }

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