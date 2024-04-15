import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../product.service';
import { ProductModel } from 'app/modules/model/product-model';
import { MenuItem, MessageService, SelectItem } from 'primeng/api';
import { Subscription, catchError, of, tap } from 'rxjs';
import { DataView } from 'primeng/dataview';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: ProductModel[];
  filteredProducts: ProductModel[];
  totalRecords: number;
  globalFilter: string = '';
  sortOrder: number;
  sortField: string;
  sortKey: string;
  items: MenuItem[] = [];
  homeItem: MenuItem = { label: 'Home', routerLink: '/' };
  productItem: MenuItem = { label: 'Products', routerLink: '/products' };
  sortOptions: SelectItem[];
  searchTerm: string = '';

  private productsSubscription: Subscription;

  @ViewChild('dv')
  dv: DataView;

  constructor(private productService: ProductService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.getProducts();
    this.sortOptions = [
      { label: 'Price High to Low', value: '!price' },
      { label: 'Price Low to High', value: 'price' }
    ];
    this.items.push(this.productItem);
  }

  ngOnDestroy(): void {
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
  }

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

  filterProducts() {
    this.globalFilter = this.globalFilter.toLowerCase();
  }

  filterData() {
    const searchTermLower = this.searchTerm.toLowerCase();

    this.filteredProducts = this.products.filter(product => {
      return product.name.toLowerCase().includes(searchTermLower);
    });
    this.totalRecords = this.filteredProducts.length;
  }

  onSortChange(event) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    }
    else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  addToCart(product: ProductModel) {
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product in your cart', life: 3000 });

  }
}

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

