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
    this.authService.userId$.subscribe(userId => {
      this.userId = Number(userId);
      if (this.userId) {
        this.cartService.getCart(Number(this.userId)).subscribe(items => {
          this.cartItems = items;
          this.calculateTotal()
        });
      } else {
        this.cartService.cartItems$.subscribe(items => {
          this.cartItems = items;
          this.calculateTotal();
        });
      }
    });

  }

  removeCartItem(productId: number) {
    if (this.userId) {
      this.cartService.removeCartItem(productId, this.userId).subscribe(() => {
        this.cartItems = this.cartItems.filter(i => i.productId !== productId);
        this.calculateTotal();
      });
    } else {
      this.cartService.removeGuestCart(productId);
    }
  }

  clearCart() {
    if (this.userId) {
      this.cartService.clearCart(this.userId).subscribe({
        next: () => {
          this.cartItems = [];
          this.total = 0;
        },
        error: (err) => console.error('Error clearing cart', err)
      });
    } else {
      this.cartService.clearGuestCart();
    }
  }

  calculateTotal() {
    this.total = this.cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  updateQuantity(productId: number, quantity: number) {
    if (this.userId) {
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
    } else {
      this.cartService.updateGuestQuantity(productId, quantity);
    }
  }
}
