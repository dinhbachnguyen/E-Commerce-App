import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { CartService } from '../../services/cart/cart.service';
import { AppModule } from '../../app.module';
import { backupProducts } from '../product-list/product-list';


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

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    this.product = this.backupProducts.find(p => p.id === productId);
    this.productService.getProduct(productId).subscribe({
      next: (res) => this.product = res,
      error: (err) => console.error(err)
    });
  }

  addToCart() {
    if (!this.product) return;

    this.cartService.addToCart({
      productId: this.product.id,
      name: this.product.name,
      price: this.product.price,
      quantity: this.quantity
    });

    alert(`${this.product.name} added to cart!`);
  }
}