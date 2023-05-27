import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LocalStorageEnum } from 'src/app/enum/localStorage.enum';
import { Permission } from 'src/app/enum/permission.enum';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { IClientItemHandle, IError, IItem, IShippingCart } from 'src/app/interfaces/api.business.interfaces';
import { ApiBusinessService } from 'src/app/services/api.business.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-shoppingcart',
  templateUrl: './shoppingcart.component.html',
  styleUrls: ['./shoppingcart.component.css']
})
export class ShoppingcartComponent implements OnInit {

  // ICONS
  faXmark = faXmark;

  // ACTIONS
  permissions:Array<string> = [''];
  PermissionEnum:any = Permission;
  error:boolean = false;
  errorMessage:string = '';
  alert:boolean = false;
  alertMessage:string = '';
  loadingItems:boolean = true;
  creatingClientItem:boolean = false;

  // DATA
  ShoppingCartItems:Array<IShippingCart> = [];
  Items:Array<IItem> = [];
  TotalAmount:number = 0;

  constructor(
    private readonly LoginService: LoginService,
    private readonly Router: Router,
    private readonly ApiBusinessService: ApiBusinessService
  ){ }

  ngOnInit(): void {
    this.LoginService.currentPermissions.subscribe(state => {
      this.permissions = state;
      if(this.permissions.length > 1 && !this.permissions.includes(Permission.ClientItem_Get_All))
        this.Router.navigate(['']);
    });
    const ShoppingCart:Array<IShippingCart>|null = JSON.parse((localStorage.getItem(LocalStorageEnum.ShoppingCart)) as string);
    if(ShoppingCart)
      this.ShoppingCartItems = ShoppingCart;

    this.getItems();
  }

  getItems(): void {
    //
    this.Items = [];
    this.TotalAmount = 0;

    if(this.ShoppingCartItems.length == 0){
      this.loadingItems = false;
      return;
    } 

    this.loadingItems = true;
    this.hideError();
    this.ShoppingCartItems.map(item => {
      let subscription:Subscription = this.ApiBusinessService.getItem(Number(item.itemId)).subscribe({
        next: (n) => this.handleNextItem(n, subscription),
        error: (e) => this.handleErrorItem(e, subscription)
      });
    });
  }
  
  handleNextItem(n:IItem, s:Subscription): void {
    //
    const ItemInShoppingCart:IItem|undefined = this.ShoppingCartItems.find(x => x.itemId == n.id);
    n.quantity = ItemInShoppingCart?.quantity;

    if(n.stock && n.quantity && n.price)
      if(n.stock >= n.quantity)
        this.TotalAmount += ( n.quantity * n.price );

    this.Items.push(n);
    this.loadingItems = false;
    s.unsubscribe();
  }

  handleErrorItem(e:HttpErrorResponse, s:Subscription): void {
    //
    this.loadingItems = false;
    this.showErrorAlert(e.error);
    s.unsubscribe();
  }

  onOrder(): void {
    //
    if(this.Items.length == 0)
      return;

    this.Items.map((Item:IItem, i:number) => {
      if(Item.stock && Item.quantity)
        if(Item.stock >= Item.quantity){
          //
          const ClientItemPayload:IClientItemHandle = {
            itemId: Item.id,
            quantity: Item.quantity
          };

          this.creatingClientItem = true;
          this.hideAlert();
          let subscription:Subscription = this.ApiBusinessService.createClientItem(ClientItemPayload).subscribe({
            next: (n) => this.handleNextOrder(n, subscription, this.Items.length, i),
            error: (e) => this.handleErrorOrder(e, subscription)
          });
        }
    });
  }

  handleNextOrder(n:any, s:Subscription, length:number, currentI:number): void {
    //
    this.creatingClientItem = false;
    if(length >= currentI){
      this.showAlert('¡Orden solicitada exitosamente!');
      localStorage.setItem(LocalStorageEnum.ShoppingCart, JSON.stringify([]));
      this.ShoppingCartItems = [];
      this.getItems();
    }
    s.unsubscribe();
  }

  handleErrorOrder(e:any, s:Subscription): void {
    //
    this.creatingClientItem = false;
    this.showErrorAlert(e);
    s.unsubscribe();
  }

  onDeleteItem(Item:IItem): void {
    //
    if(!Item)
      return;
    
    const ShoppingCart:Array<IShippingCart> = this.ShoppingCartItems.filter(x => x.itemId !== Item.id);
    localStorage.setItem(LocalStorageEnum.ShoppingCart, JSON.stringify(ShoppingCart));
    this.ShoppingCartItems = ShoppingCart;
    this.getItems();
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