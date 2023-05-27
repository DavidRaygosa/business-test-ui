import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageEnum } from 'src/app/enum/localStorage.enum';
import { Permission } from 'src/app/enum/permission.enum';
import { IError, IItem, IShippingCart } from 'src/app/interfaces/api.business.interfaces';
import { ApiBusinessService } from 'src/app/services/api.business.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {

  // ACTIONS
  permissions:Array<string> = [''];
  PermissionEnum:any = Permission;
  error:boolean = false;
  errorMessage:string = '';
  alert:boolean = false;
  alertMessage:string = '';
  loadingItems:boolean = true;

  // DATA
  Items:Array<IItem> = [];

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
    this.getItems();
  }

  getItems(): void {
    //
    this.loadingItems = true;
    this.ApiBusinessService.GetItems().subscribe({
      next: (n) => this.handleNextItems(n),
      error: (e) => this.handleErrorItems(e)
    });
  }

  handleNextItems(n:Array<IItem>): void {
    //
    this.Items = n;
    this.Items.map(Item => Item.quantity = 1);
    this.loadingItems = false;
  }

  handleErrorItems(e:HttpErrorResponse): void {
    //
    this.loadingItems = false;
    this.showErrorAlert(e.error);
  }

  //---------------------------------------------------------------> HANDLE ITEM QUANTITY

  handleRemoveQuantity(Item:IItem): void {
    //
    if(!Item || !Item.quantity)
      return;

    if(Item.quantity <= 1)
      return;

    Item.quantity--;
  }

  handleAddQuantity(Item:IItem): void {
    //
    if(!Item || !Item.quantity || !Item.stock)
      return;

    if(Item.quantity >= Item.stock)
      return;

    Item.quantity++;
  }

  //---------------------------------------------------------------> END HANDLE ITEM QUANTITY

  //---------------------------------------------------------------> HANDLE ADD SHOPPING CART

  onAddToShoppingCart(Item:IItem): void {
    //
    if(!Item)
      return;

    const ShoppingCartPayload:IShippingCart = {
      itemId: Item.id,
      quantity: Item.quantity
    };

    const ShoppingCart:Array<IShippingCart>|null = JSON.parse((localStorage.getItem(LocalStorageEnum.ShoppingCart)) as string);

    if(!ShoppingCart){
      localStorage.setItem(LocalStorageEnum.ShoppingCart, JSON.stringify([ShoppingCartPayload]));
      this.showAlert(`El articulo ${Item.code} ha sido agregado exitosamente al carrito de compras`);
      return;
    }

    ShoppingCart.push(ShoppingCartPayload);
    localStorage.setItem(LocalStorageEnum.ShoppingCart, JSON.stringify(ShoppingCart));
    this.showAlert(`El articulo ${Item.code} ha sido agregado exitosamente al carrito de compras`);
    return;
  }

  //---------------------------------------------------------------> END HANDLE ADD SHOPPING CART

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