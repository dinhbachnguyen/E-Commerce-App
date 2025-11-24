import { Component, OnInit } from '@angular/core';
import { CartService, CartItem, CartOrder } from '../../services/cart/cart.service';
import { AppModule } from '../../app.module';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-cart',
  imports: [AppModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss']
})
export class CartComponent implements OnInit {

  userId = 0;
  cartItems: CartItem[] = [];
  total = 0;

  constructor(private cartService: CartService, private authService: AuthService) { }

  ngOnInit(): void {
    // this.cartService.cartItems$.subscribe(items => {
    //   this.cartItems = items;
    //   this.total = this.cartService.getTotal();
    // });
    this.authService.userId$.subscribe(userId => {
      this.userId = Number(userId);
    });
    this.cartService.getCart(Number(this.userId)).subscribe(items => {
      this.cartItems = items;
      this.calculateTotal()
    });
  }

  removeCartItem(productId: number) {
    console.log("id=", productId)
    this.cartService.removeCartItem(productId, this.userId).subscribe(() => {
      this.cartItems = this.cartItems.filter(i => i.productId !== productId);
      this.calculateTotal();
    });
  }

  clearCart() {
    this.cartService.clearCart(this.userId).subscribe({
      next: () => {
        this.cartItems = [];
        this.total = 0;
      },
      error: (err) => console.error('Error clearing cart', err)
    });
  }

  calculateTotal() {
    this.total = this.cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  updateQuantity(productId: number, quantity: number) {
    this.cartService.updateQuantity(this.userId, productId, quantity)
      .subscribe({
        next: () => {
          const item = this.cartItems.find(i => i.productId === productId);
          if (item) {
            item.quantity = quantity;
          }
          this.calculateTotal(); 
        },
        error: (err) => console.error('Error updating quantity', err)
      });
  }

  // updateQuantity(productId: number, quantity: number) {
  //   if (quantity < 1) quantity = 1; // Minimum 1
  //   this.cartService.updateQuantity(productId, quantity);
  // }
}
