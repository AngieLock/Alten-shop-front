import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../product.service';
import { ProductModel } from 'app/modules/model/product-model';
import { Table } from 'primeng/table';
import { Subscription, catchError, of, tap } from 'rxjs';
import { ConfirmEventType, ConfirmationService, MenuItem, MessageService } from 'primeng/api';


@Component({
  selector: 'app-products-admin',
  templateUrl: './products-admin.component.html',
  styleUrls: ['./products-admin.component.scss']
})
export class ProductsAdminComponent implements OnInit {
  products: ProductModel[];
  product: ProductModel;
  filteredProducts: ProductModel[];
  homeItem: MenuItem = { label: 'Home', routerLink: '/' };
  adminItem: MenuItem = { label: 'Admin', routerLink: '/admin/products' };
  items: MenuItem[] = [];
  selectedProducts: ProductModel[] = [];
  disableDelete: boolean = true;
  private productsSubscription: Subscription;

  loading: boolean;
  totalRecords: number;
  productDialog: boolean;
  submitted: boolean;

  @ViewChild('dt')
  dt: Table;


  constructor(private productService: ProductService, private messageService: MessageService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.getProducts();
    this.items.push(this.adminItem);
    this.loading = true;
  }

  ngOnDestroy(): void {
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
  }

  // Obtention de données
  /*
  async getProducts() {
    try {
      const data = await this.productService.getProducts();
      // Faites quelque chose avec vos données
      this.products = data; // Supposons que vos données sont un tableau de produits
    } catch (error) {
      console.error('Une erreur s\'est produite lors du chargement des données:', error);
    }
  }
*/
  getProducts() {
    this.productsSubscription = this.productService.getProducts().pipe(
      tap(products => {
        this.products = products;
        this.filteredProducts = products;
      }),
      catchError(error => {
        console.error('Erreur lors du chargement des produits :', error);
        return of([]);
      })
    ).subscribe();
  }

  //New product
  openNew() {
    this.product;
    this.submitted = false;
    this.productDialog = true;
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  //Sélection
  onSelectionChange(event) {
    if (event && event.value && event.value.length > 0) {
      this.disableDelete = false;
    } else {
      this.disableDelete = true;
    }
  }

  //Méthode de suppression
  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.products = this.products.filter(val => !this.selectedProducts.includes(val));
        this.selectedProducts = null;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
      }
    });
  }

  deleteProduct(product: ProductModel) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.products = this.products.filter(val => val.id !== product.id);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
      },
      reject: () => {
        this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
      }
    });
  }

  //Save and Update product
  editProduct(product: ProductModel) {
    this.product = { ...product };
    this.productDialog = true;
  }

  saveProduct() {
    this.submitted = true;

    if (this.product.name.trim()) {
      if (this.product.id) {
        this.products[this.findIndexById(this.product.id)] = this.product;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
      }
      else {
        this.product.id = this.createId();
        this.product.image = 'product-placeholder.svg';
        this.products.push(this.product);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
      }

      this.products = [...this.products];
      this.productDialog = false;
      this.product;
    }
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): number {
    let id = 0;
    const chars = '0123456789';
    for (let i = 0; i < 5; i++) {
      const charIndex = Math.floor(Math.random() * chars.length);
      id = id * 10 + parseInt(chars.charAt(charIndex));
    }
    return id;
  }

  //Filtre disponible
  filterCode(event) {
    const filterValue = event.target.value.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.code.toLowerCase().includes(filterValue)
    );
  }

  filterName(event) {
    const filterValue = event.target.value.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(filterValue)
    );
  }

}

