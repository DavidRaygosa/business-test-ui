import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, registerLocaleData } from '@angular/common';
import localeMr from '@angular/common/locales/es-MX';
registerLocaleData(localeMr, 'es-Mx');

import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemAdminComponent } from './item-admin/item-admin.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SkeletonElementsModule } from 'skeleton-elements/angular';
import { StoreAdminComponent } from './store-admin/store-admin.component';
import { StoreItemAdminComponent } from './store-admin/store-item-admin/store-item-admin.component';
import { OrderAdminComponent } from './order-admin/order-admin.component';
import { UserAdminComponent } from './user-admin/user-admin.component';
import { RoleAdminComponent } from './role-admin/role-admin.component';
import { PermissionAdminComponent } from './permission-admin/permission-admin.component';

@NgModule({
  declarations: [
    ItemAdminComponent,
    StoreAdminComponent,
    StoreItemAdminComponent,
    OrderAdminComponent,
    UserAdminComponent,
    RoleAdminComponent,
    PermissionAdminComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    SkeletonElementsModule
  ],
  providers:[
    CurrencyPipe,
    { provide: localeMr, useValue: "es-Mx" }
  ]
})
export class AdminModule { }