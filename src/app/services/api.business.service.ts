import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ILogin, IItem, IRegister, IStore, IItemStoreHandle, IClientItemHandle, IClient, IRole, IPermission } from '../interfaces/api.business.interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiBusinessService {
  private readonly url:string = environment.apiBusinessTest; 

  constructor(
    private readonly http: HttpClient
  ) { }

  validate(): Observable<any>{
    return this.http.get(`${this.url}authentication/validate`);
  }

  login(loginPayload:ILogin): Observable<any>{
    return this.http.post(`${this.url}authentication/login`, loginPayload);
  }

  register(registerPayload:IRegister): Observable<any>{
    return this.http.post(`${this.url}client`, registerPayload);
  }

  GetItems(): Observable<any>{
    return this.http.get(`${this.url}item`);
  }

  getItem(id:number): Observable<any>{
    return this.http.get(`${this.url}item/${id}`);
  }

  createItem(itemPayload:IItem): Observable<any>{
    return this.http.post(`${this.url}item`, itemPayload);
  }

  updateItem(itemPayload:IItem): Observable<any>{
    return this.http.put(`${this.url}item/${itemPayload.id}`, itemPayload);
  }

  deleteItem(id:number): Observable<any>{
    return this.http.delete(`${this.url}item/${id}`);
  }

  getStores(): Observable<any>{
    return this.http.get(`${this.url}store`);
  }

  getStore(id:number): Observable<any>{
    return this.http.get(`${this.url}store/${id}`);
  }

  createStore(storePayload: IStore): Observable<any>{
    return this.http.post(`${this.url}store`, storePayload);
  }

  updateStore(storePayload: IStore): Observable<any>{
    return this.http.put(`${this.url}store/${storePayload.id}`, storePayload);
  }

  deleteStore(storePayload: IStore): Observable<any>{
    return this.http.delete(`${this.url}store/${storePayload.id}`);
  }

  getItemStore(storeId:number): Observable<any>{
    return this.http.get(`${this.url}itemstore?StoreId=${storeId}`);
  }

  createItemStore(itemStorePayload:IItemStoreHandle): Observable<any>{
    return this.http.post(`${this.url}itemstore`, itemStorePayload);
  }

  updateItemStore(id:number, itemStorePayload:IItemStoreHandle): Observable<any>{
    return this.http.put(`${this.url}itemstore/${id}`, itemStorePayload);
  }
  
  deleteItemStore(id:number): Observable<any>{
    return this.http.delete(`${this.url}itemstore/${id}`);
  }

  createClientItem(clientItemPayload:IClientItemHandle): Observable<any>{
    return this.http.post(`${this.url}clientitem`, clientItemPayload);
  }

  getClientItems(): Observable<any>{
    return this.http.get(`${this.url}clientitem`);
  }

  deleteClientItem(id:number): Observable<any>{
    return this.http.delete(`${this.url}clientitem/${id}`);
  }

  getUsers(): Observable<any>{
    return this.http.get(`${this.url}client`);
  }

  updateUser(Id:number, ClientPayload:IClient): Observable<any>{
    return this.http.put(`${this.url}client/${Id}`, ClientPayload);
  }

  deleteUser(Id:number): Observable<any>{
    return this.http.delete(`${this.url}client/${Id}`);
  }

  getRoles(): Observable<any>{
    return this.http.get(`${this.url}role`);
  }

  createRole(rolePayload:IRole): Observable<any>{
    return this.http.post(`${this.url}role`, rolePayload);
  }

  updateRole(id:number, rolePayload:IRole): Observable<any>{
    return this.http.put(`${this.url}role/${id}`, rolePayload);
  }
  
  deleteRole(id:number): Observable<any>{
    return this.http.delete(`${this.url}role/${id}`);
  }

  getPermissions(): Observable<any>{
    return this.http.get(`${this.url}permission`);
  }

  createPermission(permissionPayload:IPermission): Observable<any>{
    return this.http.post(`${this.url}permission`, permissionPayload);
  }
  
  updatePermission(id:number, permissionPayload:IPermission): Observable<any>{
    return this.http.put(`${this.url}permission/${id}`, permissionPayload);
  }

  deletePermission(id:number): Observable<any>{
    return this.http.delete(`${this.url}permission/${id}`);
  }

}