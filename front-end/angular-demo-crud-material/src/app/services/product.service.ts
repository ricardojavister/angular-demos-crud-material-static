import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../model/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Pineapple',
      description: 'There are many variations of passages of Lorem.',
      price: 650,
      image:
        'https://images.unsplash.com/photo-1587883012610-e3df17d41270?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    },
    {
      id: 2,
      name: 'Orange',
      description: 'There are many variations of passages of Lorem.',
      price: 350,
      image:
        'https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80',
    },
    {
      id: 3,
      name: 'Grapes',
      description: 'There are many variations of passages of Lorem.',
      price: 120,
      image:
        'https://images.unsplash.com/photo-1577069861033-55d04cec4ef5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80',
    },
  ];
  private myProducts = new BehaviorSubject<Product[]>([]);
  myProducts$ = this.myProducts.asObservable();

  constructor() {
    this.myProducts.next(this.products);
  }

  add(product: Product) {
    this.products.push(product);
    this.myProducts.next(this.products);
  }

  update(product: Product) {
    this.delete(product);
    this.add(product);
  }

  delete(product: Product) {
    this.products.forEach((value, index) => {
      if (value.name == product.name) this.products.splice(index, 1);
    });
    this.myProducts.next(this.products);
  }
}
