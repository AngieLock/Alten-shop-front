
import { CommonModule } from '@angular/common';
import { ProductsAdminComponent } from './products-admin/products-admin.component';
import { ProductsComponent } from './products/products.component';
import { ProductService } from './product.service';
import { NgModule } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DataViewModule } from 'primeng/dataview';
import { AccordionModule } from 'primeng/accordion';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { BrowserModule } from '@angular/platform-browser';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmationService, MessageService } from 'primeng/api';


@NgModule({
  declarations: [
    ProductsAdminComponent,
    ProductsComponent
  ],
  providers: [ProductService, MessageService, ConfirmationService],
  imports: [
    CommonModule,
    TableModule,
    DataViewModule,
    AccordionModule,
    MenuModule,
    ButtonModule,
    BrowserModule,
    BreadcrumbModule,
    RatingModule,
    FormsModule,
    DropdownModule
  ]
})
export class ProductModule { }
