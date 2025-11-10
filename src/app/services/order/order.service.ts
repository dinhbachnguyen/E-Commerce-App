import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartService, CartItem } from '../cart/cart.service';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';

export interface Order {
  id?: number;
  customer: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: CartItem[];
  total: number;
  orderDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = environment.apiUrl + "5000/api/order"

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cartService: CartService
  ) { }

  // Submit a new order
  submitOrder(order: Order): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post(this.apiUrl, order, { headers });
  }

  // Get all orders for the logged-in user
  getOrders(): Observable<Order[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Order[]>(this.apiUrl, { headers });
  }
}
