import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemAdminComponent } from './item-admin/item-admin.component';
import { StoreAdminComponent } from './store-admin/store-admin.component';
import { StoreItemAdminComponent } from './store-admin/store-item-admin/store-item-admin.component';
import { OrderAdminComponent } from './order-admin/order-admin.component';
import { UserAdminComponent } from './user-admin/user-admin.component';
import { RoleAdminComponent } from './role-admin/role-admin.component';
import { PermissionAdminComponent } from './permission-admin/permission-admin.component';

const routes: Routes = [
  {
    path: '',
    component: ItemAdminComponent
  },
  {
    path: 'store',
    component: StoreAdminComponent
  },
  {
    path: 'store/:id',
    component: StoreItemAdminComponent
  },
  {
    path: 'order',
    component: OrderAdminComponent
  },
  {
    path: 'user',
    component: UserAdminComponent
  },
  {
    path: 'role',
    component: RoleAdminComponent
  },
  {
    path: 'permission',
    component: PermissionAdminComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }