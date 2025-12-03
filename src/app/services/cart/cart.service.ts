import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

export interface CartOrder {
  userId: number;
  productId: number;
  quantity: number;
}

export interface CartItem {
  userId?: number;
  productId: number;
  quantity: number;
  product: {
    name: string;
    price: number;
  }
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = environment.apiUrl + "/api/cart"

  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  constructor(private http: HttpClient) {
    // Load cart from localStorage if available
    const savedCart = localStorage.getItem('guestCart');
    if (savedCart) {
      this.cartItems.next(JSON.parse(savedCart));
    }

  }

  addToCart(item: CartOrder): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, item);
  }

  getCart(userId: number): Observable<any> {
    return this.http.get<CartItem>(`${this.apiUrl}/${userId}`);
  }

  removeCartItem(cartItemId: number, userId: number) {
    return this.http.delete(`${this.apiUrl}/${cartItemId}/${userId}`)
  }

  clearCart(userId: number) {
    return this.http.delete(`${this.apiUrl}/clear/${userId}`);
  }

  updateQuantity(userId: number, productId: number, quantity: number) {
    return this.http.put(`${this.apiUrl}/update`, {
      userId,
      productId,
      quantity
    });
  }

  private updateLocalStorage(items: CartItem[]) {
    localStorage.setItem('guestCart', JSON.stringify(items));
  }

  addToGuestCart(item: CartItem) {
    const items = this.cartItems.value;
    const existingItem = items.find(i => i.productId === item.productId);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      items.push(item);
    }

    this.cartItems.next(items);
    this.updateLocalStorage(items);
  }

  removeGuestCart(productId: number) {
    const items = this.cartItems.value.filter(i => i.productId !== productId);
    this.cartItems.next(items);
    this.updateLocalStorage(items);
  }

  clearGuestCart() {
    this.cartItems.next([]);
    localStorage.removeItem('cart');
  }

  updateGuestQuantity(productId: number, quantity: number) {
    const items = this.cartItems.value.map(i => {
      if (i.productId === productId) {
        i.quantity = quantity;
      }
      return i;
    });
    this.cartItems.next(items);
    this.updateLocalStorage(items);
  }

  // getTotal(): number {
  // return this.cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0);
  // }
}
