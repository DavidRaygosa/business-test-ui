import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { ItemsComponent } from './items/items.component';
import { SkeletonElementsModule } from 'skeleton-elements/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ShoppingcartComponent } from './shoppingcart/shoppingcart.component';


@NgModule({
  declarations: [
    ItemsComponent,
    ShoppingcartComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    SkeletonElementsModule,
    FontAwesomeModule
  ]
})
export class ClientModule { }