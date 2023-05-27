import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyPipe } from '@angular/common';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { faPlus, faBarcode, faTextHeight, faCircleDollarToSlot, faImage, faBoxArchive, faPencil, faXmark } from '@fortawesome/free-solid-svg-icons';
import { IError, IItem } from 'src/app/interfaces/api.business.interfaces';
import { ApiBusinessService } from 'src/app/services/api.business.service';
import { Permission } from 'src/app/enum/permission.enum';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-item-admin',
  templateUrl: './item-admin.component.html',
  styleUrls: ['./item-admin.component.css']
})
export class ItemAdminComponent implements OnInit {
  // ICONS
  faPlus = faPlus;
  faBarcode = faBarcode;
  faTextHeight = faTextHeight;
  faCircleDollarToSlot = faCircleDollarToSlot;
  faImage = faImage;
  faBoxArchive = faBoxArchive;
  faPencil = faPencil;
  faXmark = faXmark;

  // ACTIONS
  permissions:Array<string> = [''];
  PermissionEnum:any = Permission;
  error:boolean = false;
  errorMessage:string = '';
  alert:boolean = false;
  alertMessage:string = '';
  loadingItems:boolean = true;
  creatingItem:boolean = false;
  updatingItem:boolean = false;
  deletingItem:boolean = false;

  // FORMS
  newItemForm = new FormGroup({
    code: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(256)
    ])),
    description: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(256)
    ])),
    price: new FormControl('', Validators.compose([
      Validators.required
    ])),
    imageBase64: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(3)
    ])),
    stock: new FormControl('', Validators.compose([
      Validators.required
    ]))
  });
  editItemForm = new FormGroup({
    id: new FormControl('', Validators.compose([
      Validators.required
    ])),
    code: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(256)
    ])),
    description: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(256)
    ])),
    price: new FormControl('', Validators.compose([
      Validators.required
    ])),
    imageBase64: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(3)
    ])),
    stock: new FormControl('', Validators.compose([
      Validators.required
    ]))
  });
  deleteItemForm = new FormGroup({
    id: new FormControl('', Validators.compose([
      Validators.required
    ])),
    code: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(256)
    ])),
    description: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(256)
    ])),
    price: new FormControl('', Validators.compose([
      Validators.required
    ])),
    imageBase64: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(3)
    ])),
    stock: new FormControl('', Validators.compose([
      Validators.required
    ]))
  });

  // DOM ELEMENTS
  @ViewChild('newItemButton') newItemButton:ElementRef | undefined;
  @ViewChild('editItemButton') editItemButton:ElementRef | undefined;
  @ViewChild('deleteItemButton') deleteItemButton:ElementRef | undefined;
  imagePath:SafeResourceUrl | undefined;
  imagePathEdit:SafeResourceUrl | undefined;
  imagePathDelete:SafeResourceUrl | undefined;

  // ITEMS
  Items:Array<IItem> = [];

  constructor(
    private readonly LoginService: LoginService,
    private readonly Router: Router,
    private readonly DomSanitizer: DomSanitizer,
    private readonly ApiBusinessService: ApiBusinessService,
    private readonly CurrencyPipe: CurrencyPipe
  ){ }

  ngOnInit(): void {
    this.LoginService.currentPermissions.subscribe(state => {
      this.permissions = state;
      if(this.permissions.length > 1 && !this.permissions.includes(Permission.Item_Admin))
        this.Router.navigate(['']);
    });    
    this.getItems();
    this.handleFormTranforms();
  }

  handleFormTranforms(): void {
    //
    this.newItemForm.valueChanges.subscribe( form => {
      if(form.price){
        this.newItemForm.patchValue({
          price: this.CurrencyPipe.transform(form.price.replace(/\D/g, '').replace(/^0+/,''), 'USD', 'symbol', '1.0-0')
        }, { emitEvent: false })
      }
    });
    this.editItemForm.valueChanges.subscribe( form => {
      if(form.price){
        this.editItemForm.patchValue({
          price: this.CurrencyPipe.transform(form.price.replace(/\D/g, '').replace(/^0+/,''), 'USD', 'symbol', '1.0-0')
        }, { emitEvent: false })
      }
    });
  }

  getItems(): void {
    //
    this.loadingItems = true;
    this.hideError();
    this.ApiBusinessService.GetItems().subscribe({
      next: (n) => this.handleNextItems(n),
      error: (e) => this.handleErrorItems(e)
    });
  }

  handleNextItems(n:Array<IItem>){
    //
    this.loadingItems = false;
    this.Items = n;
  }

  handleErrorItems(e:HttpErrorResponse){
    //
    this.loadingItems = false;
    this.showErrorAlert(e.error);
  }

  //---------------------------------------------------------------> CREATE ITEM

  onNewItemSubmit(): void{
    //
    if(
      !this.newItemForm.value.code ||
      !this.newItemForm.value.description ||
      !this.newItemForm.value.price ||
      !this.newItemForm.value.imageBase64 ||
      !this.newItemForm.value.stock
    )
      return;

    const NewItemPayload:IItem = {
      code: this.newItemForm.value.code,
      description: this.newItemForm.value.description,
      price: Number((this.newItemForm.value.price).replace(/[$,]/g, "")),
      imageBase64: this.newItemForm.value.imageBase64,
      stock: Number(this.newItemForm.value.stock)
    };
    
    this.hideError();
    this.hideAlert();
    this.creatingItem = true;
    this.ApiBusinessService.createItem(NewItemPayload).subscribe({
      next: (n) => this.handleNextItem(n),
      error: (e) => this.handleErrorItem(e)
    })
  }

  handleNextItem(n:any): void {
    //
    this.creatingItem = false;
    this.newItemForm.reset();
    this.imagePath = undefined;
    this.newItemButton?.nativeElement.click();
    this.showAlert('¡Articulo creado exitosamente!');
    this.getItems();
  }

  handleErrorItem(e:HttpErrorResponse): void {
    //
    this.creatingItem = false;
    this.showErrorAlert(e.error);
  }

  onShowModalNewItem(): void{
    //
    this.newItemButton?.nativeElement.click();
  }

  onNewImageSelected(event:any): void{
    //
    const File:File = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(File);
    reader.onload = () => {
      this.newItemForm.controls.imageBase64.setValue((reader.result as string));
      this.imagePath = this.DomSanitizer.bypassSecurityTrustResourceUrl((this.newItemForm.value.imageBase64 as string));
    };
  }

  //---------------------------------------------------------------> END CREATE ITEM

  //---------------------------------------------------------------> UPDATE ITEM

  onShowModalEditItem(Item:IItem): void {
    //
    if(!Item)
      return;
    
    this.editItemForm.controls.id.setValue((Item.id as number).toString());
    this.editItemForm.controls.code.setValue((Item.code as string));
    this.editItemForm.controls.description.setValue((Item.description as string));
    this.editItemForm.controls.price.setValue((Item.price as number).toString());
    this.editItemForm.controls.imageBase64.setValue((Item.image as string));
    this.editItemForm.controls.stock.setValue((Item.stock as number).toString());

    if(this.editItemForm.value.imageBase64)
      this.imagePathEdit = this.DomSanitizer.bypassSecurityTrustResourceUrl((this.editItemForm.value.imageBase64 as string));

    this.editItemButton?.nativeElement.click();
  }

  onEditItemSubmit(): void {
    //
    if(
      !this.editItemForm.value.code ||
      !this.editItemForm.value.description ||
      !this.editItemForm.value.price ||
      !this.editItemForm.value.imageBase64 ||
      !this.editItemForm.value.stock
    )
      return;

    const ItemPayload:IItem = {
      id: Number(this.editItemForm.value.id),
      code: this.editItemForm.value.code,
      description: this.editItemForm.value.description,
      price: Number((this.editItemForm.value.price).replace(/[$,]/g, "")),
      imageBase64: this.editItemForm.value.imageBase64,
      stock: Number(this.editItemForm.value.stock)
    };

    this.updatingItem = true;
    this.hideError();
    this.hideAlert();
    this.ApiBusinessService.updateItem(ItemPayload).subscribe({
      next: (n) => this.handleNextUpdateItem(n),
      error: (e) => this.handleErrorUpdateItem(e)
    });
  }

  handleNextUpdateItem(n:any): void {
    //
    this.updatingItem = false;
    this.editItemForm.reset();
    this.imagePathEdit = undefined;
    this.editItemButton?.nativeElement.click();
    this.showAlert('¡Articulo actualizado exitosamente!');
    this.getItems();
  }

  handleErrorUpdateItem(e:HttpErrorResponse): void {
    //
    this.updatingItem = false;
    this.showErrorAlert(e.error);
  }

  onEditImageSelected(event:any): void{
    //
    const File:File = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(File);
    reader.onload = () => {
      this.editItemForm.controls.imageBase64.setValue((reader.result as string));
      this.imagePathEdit = this.DomSanitizer.bypassSecurityTrustResourceUrl((this.editItemForm.value.imageBase64 as string));
    };
  }

  //---------------------------------------------------------------> END UPDATE ITEM

  //---------------------------------------------------------------> DELETE ITEM

  onShowModalDeleteItem(Item:IItem): void {
    //
    if(!Item)
      return;
    
    this.deleteItemForm.controls.id.setValue((Item.id as number).toString());
    this.deleteItemForm.controls.code.setValue((Item.code as string));
    this.deleteItemForm.controls.description.setValue((Item.description as string));
    this.deleteItemForm.controls.price.setValue((Item.price as number).toString());
    this.deleteItemForm.controls.imageBase64.setValue((Item.image as string));
    this.deleteItemForm.controls.stock.setValue((Item.stock as number).toString());

    if(this.deleteItemForm.value.imageBase64)
      this.imagePathDelete = this.DomSanitizer.bypassSecurityTrustResourceUrl((this.deleteItemForm.value.imageBase64 as string));

    this.deleteItemButton?.nativeElement.click();
  }

  onDeleteItem(): void {
    //
    if(
      !this.deleteItemForm.value.code ||
      !this.deleteItemForm.value.id
    )
      return;

    this.hideAlert();
    this.hideError();
    this.deletingItem = true;
    this.ApiBusinessService.deleteItem(Number(this.deleteItemForm.value.id)).subscribe({
      next: (n) => this.handleNextDeleteItem(n),
      error: (e) => this.handleErrorDeleteItem(e)
    });
  }

  handleNextDeleteItem(n:any): void {
    //
    this.deletingItem = false;
    this.deleteItemForm.reset();
    this.imagePathDelete = undefined;
    this.deleteItemButton?.nativeElement.click();
    this.showAlert('¡Articulo eliminado exitosamente!');
    this.getItems();
  }

  handleErrorDeleteItem(e:HttpErrorResponse): void {
    //
    this.deletingItem = false;
    this.showErrorAlert(e.error);
  }

  //---------------------------------------------------------------> END DELETE ITEM

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