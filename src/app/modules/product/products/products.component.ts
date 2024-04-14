import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../product.service';
import { ProductModel } from 'app/modules/model/product-model';
import { MenuItem, SelectItem } from 'primeng/api';
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
  totalRecords: number; // Nombre total de produits
  currentPage: number = 1; // Page actuelle
  globalFilter: string = '';
  sortOrder: number;
  sortField: string;
  sortKey: string;

  items: MenuItem[] = [];
  homeItem: MenuItem = { label: 'Home', routerLink: '/' };
  productItem: MenuItem = { label: 'Products', routerLink: '/products' };
  sortOptions: SelectItem[];
  searchTerm: string = '';
  loading: boolean;

  private productsSubscription: Subscription;

  @ViewChild('dt')
  dt: DataView;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getProducts();
    this.sortOptions = [
      { label: 'Price High to Low', value: '!price' },
      { label: 'Price Low to High', value: 'price' }
    ];
    this.items.push(this.productItem);
    this.loading = true;
  }

  ngOnDestroy(): void {
    // Désabonner lors de la destruction du composant
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
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
    // Convertir le terme de recherche en minuscules pour une recherche insensible à la casse
    const searchTermLower = this.searchTerm.toLowerCase();

    // Filtrer les données en fonction du terme de recherche
    this.filteredProducts = this.products.filter(product => {
      // Mettez ici les conditions de filtrage en fonction de vos besoins
      // Par exemple, si vous voulez filtrer par nom de produit :
      return product.name.toLowerCase().includes(searchTermLower);
    });

    // Mettre à jour le nombre total d'enregistrements pour la pagination
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

  addToCart(product: ProductModel) { }
}

