import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // Observable to track cart items
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  constructor() {
    // Load cart from localStorage if available
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems.next(JSON.parse(savedCart));
    }
  }

  private updateLocalStorage(items: CartItem[]) {
    localStorage.setItem('cart', JSON.stringify(items));
  }

  // Add a product to the cart
  addToCart(item: CartItem) {
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

  // Remove a product from the cart
  removeFromCart(productId: number) {
    const items = this.cartItems.value.filter(i => i.productId !== productId);
    this.cartItems.next(items);
    this.updateLocalStorage(items);
  }

  // Update quantity of a product
  updateQuantity(productId: number, quantity: number) {
    const items = this.cartItems.value.map(i => {
      if (i.productId === productId) {
        i.quantity = quantity;
      }
      return i;
    });
    this.cartItems.next(items);
    this.updateLocalStorage(items);
  }

  // Clear entire cart
  clearCart() {
    this.cartItems.next([]);
    localStorage.removeItem('cart');
  }

  // Get total price of cart
  getTotal(): number {
    return this.cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0);
  }
}
