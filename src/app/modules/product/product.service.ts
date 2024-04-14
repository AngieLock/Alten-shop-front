import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { ProductModel } from '../model/product-model';

@Injectable({
  providedIn: 'root'
})


export class ProductService {

  private productsUrl = '../assets/products.json';

  constructor(private http: HttpClient) { }
  /*
    getProducts(): Promise<any> {
      return firstValueFrom(this.http.get<any>(this.productsUrl));
    }
    */
  getProducts(): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(this.productsUrl);
  }


  addProduct(product: ProductModel): Observable<any> {
    return this.http.post<any>(this.productsUrl, product);
  }

  deleteProduct(id: number): Observable<Response> {
    const url = `${this.productsUrl}/${id}`;
    return this.http.delete<Response>(url);
  }

  updateProduct(product: ProductModel): Observable<any> {
    const url = `${this.productsUrl}/${product.id}`;
    return this.http.put<any>(url, product);
  }
}
