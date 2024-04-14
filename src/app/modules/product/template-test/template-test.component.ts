import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductModel } from 'app/modules/model/product-model';
import { ProductService } from 'app/modules/product/product.service';
import { SelectItem } from 'primeng/api';
import { Subscription, catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-template-test',
  templateUrl: './template-test.component.html',
  styleUrls: ['./template-test.component.scss']
})
export class TemplateTestComponent implements OnInit {
  products: ProductModel[];

  sortOptions: SelectItem[];
  globalFilter: string = '';

  searchTerm: string = '';
  sortOrder: number;
  totalRecords: number;
  sortField: string;

  sortKey: string;
  filteredProducts: ProductModel[];
  private productsSubscription: Subscription;

  @ViewChild('dt')
  dt: DataView;

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.getProducts()
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
}
