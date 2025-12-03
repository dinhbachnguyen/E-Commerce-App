import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { CartService } from '../../services/cart/cart.service';
import { AppModule } from '../../app.module';
import { AuthService } from '../../services/auth/auth.service';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.scss'],
  imports: [AppModule]

})
export class ProductDetailComponent implements OnInit {

  product: any;
  quantity: number = 1;
  userId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProduct(productId).subscribe({
      next: (res) => this.product = res,
      error: (err) => console.error(err)
    });
    this.authService.userId$.subscribe(userId => {
      this.userId = userId;
    });
  }

  addToCart(product: any) {
    if (!this.userId) {
      this.cartService.addToGuestCart({
        productId: product.id,
        quantity: this.quantity,
        product: {
          name: product.name,
          price: product.price
        }
      });
      this.toastService.show(`${this.quantity} ${product.name} added to cart!`, 'success', 2000);
      return;
    }

    this.cartService.addToCart({
      userId: Number(this.userId),
      productId: product.id,
      quantity: this.quantity,
    }).subscribe({
      next: (res) => {
        this.toastService.show(`${this.quantity} ${product.name} added to cart!`, 'success', 2000);
      },
      error: (err) => console.error('Error adding to cart', err)
    });
  }
}