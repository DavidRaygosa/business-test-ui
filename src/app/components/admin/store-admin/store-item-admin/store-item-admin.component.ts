import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { faPlus, faPencil, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Permission } from 'src/app/enum/permission.enum';
import { IError, IItem, IItemStore, IItemStoreHandle, IStore } from 'src/app/interfaces/api.business.interfaces';
import { ApiBusinessService } from 'src/app/services/api.business.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-store-item-admin',
  templateUrl: './store-item-admin.component.html',
  styleUrls: ['./store-item-admin.component.css']
})
export class StoreItemAdminComponent implements OnInit, OnDestroy {

  RouteSubscription:Subscription | undefined
  StoreId:number = 0;

  // ICONS
  faPlus = faPlus;
  faPencil = faPencil;
  faXmark = faXmark;

  // ACTIONS
  permissions:Array<string> = [''];
  PermissionEnum:any = Permission;
  error:boolean = false;
  errorMessage:string = '';
  alert:boolean = false;
  alertMessage:string = '';
  loadingStore:boolean = true;
  loadingItemStore:boolean = false;
  loadingItems:boolean = false;
  creatingItemStore:boolean = false;
  updatingItemStore:boolean = false;
  deletingItemStore:boolean = false;

  // DOM ELEMENTS
  @ViewChild('newItemStoreButton') newItemStoreButton:ElementRef | undefined;
  @ViewChild('editItemStoreButton') editItemStoreButton:ElementRef | undefined;
  @ViewChild('deleteItemStoreButton') deleteItemStoreButton:ElementRef | undefined;

  // DATA
  Store:IStore = {};
  Items:Array<IItem> = [];
  ItemsStore:Array<IItemStore> = [];
  handleItemStore:IItemStore | undefined;
  offset = new Date().getTimezoneOffset();

  constructor(
    private readonly LoginService: LoginService,
    private readonly ActivatedRoute: ActivatedRoute,
    private readonly ApiBusinessService: ApiBusinessService,
    private readonly Router: Router
  ){ }

  ngOnInit(): void {
    this.LoginService.currentPermissions.subscribe(state => {
      this.permissions = state;
      if(this.permissions.length > 1 && !this.permissions.includes(Permission.Store_Admin))
        this.Router.navigate(['']);
    }); 
    this.RouteSubscription = this.ActivatedRoute.params.subscribe(params => {
      this.StoreId = Number(params['id']);
      this.getStore();
    });
  }

  ngOnDestroy(): void {
    if(this.RouteSubscription)
      this.RouteSubscription.unsubscribe();
  }

  getStore(): void {
    //
    if(!this.StoreId)
      return;

    this.loadingStore = true;
    this.hideError();
    this.ApiBusinessService.getStore(this.StoreId).subscribe({
      next: (n) => this.handleNextStore(n),
      error: (e) => this.handleErrorStore(e)
    });
  }

  handleNextStore(n:IStore): void {
    //
    this.Store = n;
    this.loadingStore = false;
    this.getItemsInStore();
    this.getItems();
  }

  handleErrorStore(e:HttpErrorResponse): void {
    //
    this.loadingStore = false;
    this.showErrorAlert(e.error);
    this.Router.navigate(['admin/store']);
  }

  //---------------------------------------------------------------> GET ITEMS

  getItems(): void {
    //
    this.loadingItems = true;
    this.hideError();
    this.ApiBusinessService.GetItems().subscribe({
      next: (n) => this.handleNextItems(n),
      error: (e) => this.handleErrorItems(e)
    });
  }

  handleNextItems(n:Array<IItem>): void {
    //
    this.Items = n;
    this.loadingItems = false;
  }

  handleErrorItems(e:HttpErrorResponse): void {
    //
    this.loadingItems = false;
    this.showErrorAlert(e.error);
  }

  //---------------------------------------------------------------> END GET ITEMS

  //---------------------------------------------------------------> GET ITEMS IN STORE

  getItemsInStore(): void {
    //
    if(!this.Store)
      return;

    this.loadingItemStore = true;
    this.hideError();
    this.ApiBusinessService.getItemStore((this.Store.id as number)).subscribe({
      next: (n) => this.handleNextItemStore(n),
      error: (e) => this.handleErrorItemStore(e)
    });
  }

  handleNextItemStore(n:Array<IItemStore>): void {
    //
    this.ItemsStore = n;
    this.loadingItemStore = false;
  }

  handleErrorItemStore(e:any): void {
    //
    this.loadingItemStore = false;
    this.showErrorAlert(e.error);
  }

  //---------------------------------------------------------------> END GET ITEMS IN STORE

  //---------------------------------------------------------------> CREATE ITEM TO STORE
  
  onShowAddItemModal(): void {
    //
    this.newItemStoreButton?.nativeElement.click();
  }

  onCreateItemStore(Item:IItem): void {
    //
    if(!Item || !this.Store)
      return;

    const ItemStorePayload:IItemStoreHandle = {
      itemId: Item.id,
      storeId: this.Store.id
    };

    this.creatingItemStore = true;
    this.hideAlert();
    this.hideError();
    this.ApiBusinessService.createItemStore(ItemStorePayload).subscribe({
      next: (n) => this.handleNextCreateItemStore(n),
      error: (e) => this.handleErrorCreateItemStore(e)
    });
  }

  handleNextCreateItemStore(n:any): void {
    //
    this.creatingItemStore = false;
    this.newItemStoreButton?.nativeElement.click();
    this.getItemsInStore();
    this.showAlert('¡Articulo agregado a la sucursal exitosamente!');
  }

  handleErrorCreateItemStore(e:HttpErrorResponse): void {
    //
    this.creatingItemStore = false;
    this.showErrorAlert(e.error);
  }

  //---------------------------------------------------------------> END CREATE ITEM STORE

  //---------------------------------------------------------------> UPDATE ITEM STORE

  onShowUpdateModal(ItemStore:IItemStore): void {
    //
    if(!ItemStore.id)
      return;

    this.handleItemStore = ItemStore;
    this.editItemStoreButton?.nativeElement.click();
  }

  onUpdateItemStore(item:IItem): void {
    //
    if(!this.handleItemStore || !item)
      return;

    let existsItemInStore:boolean = false;
    this.ItemsStore.map(ItemStore => {
      if(ItemStore.item?.id == item.id)
        existsItemInStore = true;
    });

    if(existsItemInStore){
      this.showErrorAlert('Articulo actualmente en la sucursal');
      return;
    }

    const ItemStorePayload:IItemStoreHandle = {
      itemId: item.id
    };
    
    this.updatingItemStore = true;
    this.hideAlert();
    this.hideError();
    this.ApiBusinessService.updateItemStore((this.handleItemStore.id as number), ItemStorePayload).subscribe({
      next: (n) => this.handleNextUpdateItemStore(n),
      error: (e) => this.handleErrorUpdateItemStore(e)
    });
  }

  handleNextUpdateItemStore(n:any): void {
    //
    this.updatingItemStore = false;
    this.editItemStoreButton?.nativeElement.click();
    this.handleItemStore = undefined;
    this.getItemsInStore();
    this.showAlert('¡Articulo actualizado en la sucursal!');
  }

  handleErrorUpdateItemStore(e:HttpErrorResponse): void {
    //
    this.updatingItemStore = false;
    this.showErrorAlert(e.error);
  }

  //---------------------------------------------------------------> END UPDATE ITEM STORE

  //---------------------------------------------------------------> DELETE ITEM STORE

  onShowDeleteModal(ItemStore:IItemStore): void {
    //
    if(!ItemStore.id)
      return;

    this.handleItemStore = ItemStore;
    this.deleteItemStoreButton?.nativeElement.click();
  }

  onDeleteItemStore(): void {
    //
    if(!this.handleItemStore)
      return;

    this.deletingItemStore = true;
    this.hideAlert();
    this.hideError();
    this.ApiBusinessService.deleteItemStore((this.handleItemStore.id as number)).subscribe({
      next: (n) => this.handleNextDeleteItemStore(n),
      error: (e) => this.handleErrorDeleteItemStore(e)
    });
  }

  handleNextDeleteItemStore(n:any): void {
    //
    this.deletingItemStore = false;
    this.deleteItemStoreButton?.nativeElement.click();
    this.handleItemStore = undefined;
    this.getItemsInStore();
    this.showAlert('¡Articulo eliminado de la sucursal!');
  }

  handleErrorDeleteItemStore(e:any): void {
    //
    this.deletingItemStore = false;
    this.showErrorAlert(e.error);
  }

  //---------------------------------------------------------------> END DELETE ITEM STORE

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