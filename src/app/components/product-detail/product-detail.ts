import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { CartService } from '../../services/cart/cart.service';
import { AppModule } from '../../app.module';
import { backupProducts } from '../product-list/product-list';
import { AuthService } from '../../services/auth/auth.service';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.scss'],
  imports: [AppModule]

})
export class ProductDetailComponent implements OnInit {

  product: any;
  quantity: number = 1;
  backupProducts = backupProducts;
  userId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    this.product = this.backupProducts.find(p => p.id === productId);
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
      alert('You need to sign in to add products to your cart.');
      return;
    }

    this.cartService.addToCart({
      userId: Number(this.userId),
      productId: product.id,
      quantity: this.quantity,
    }).subscribe({
      next: (res) => {
        // alert(`${product.name} added to cart!`);
      },
      error: (err) => console.error('Error adding to cart', err)
    });
  }
}