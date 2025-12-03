import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { CartService } from '../../services/cart/cart.service';
import { AppModule } from '../../app.module';
import { AuthService } from '../../services/auth/auth.service';
import { ToastService } from '../../services/toast/toast.service';

interface Toast {
  id: number;
  message: string;
}

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.scss'],
  imports: [AppModule]
})

export class ProductListComponent implements OnInit {

  products: any[] = [];
  userId: string | null = null;


  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.products = [...this.products, ...res];
      },
      error: (err) => {
        console.error('Backend failed, using backup products:', err);
      }
    });
    this.authService.userId$.subscribe(userId => {
      this.userId = userId;
    });
  }

  addToCart(product: any) {
    if (!this.userId) {
      this.cartService.addToGuestCart({
        productId: product.id,
        quantity: 1,
        product: {
          name: product.name,
          price: product.price
        }
      });
      this.toastService.show(`${product.name} added to cart!`, 'success', 2000);
      return;
    }

    this.cartService.addToCart({
      userId: Number(this.userId),
      productId: product.id,
      quantity: 1,
    }).subscribe({
      next: (res) => {
        this.toastService.show(`${product.name} added to cart!`, 'success', 2000);
      },
      error: (err) => console.error('Error adding to cart', err)
    });
  }
}
