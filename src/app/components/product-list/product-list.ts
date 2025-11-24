import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { CartService } from '../../services/cart/cart.service';
import { AppModule } from '../../app.module';
import { AuthService } from '../../services/auth/auth.service';

export const backupProducts = [
  // {
  //   id: 1,
  //   name: "Gaming Laptop",
  //   description: "High performance laptop with RTX graphics and 16GB RAM.",
  //   price: 1299.99,
  //   imageUrl: "gaming-laptop.jpg"
  // },
  // {
  //   id: 2,
  //   name: "Wireless Headphones",
  //   description: "Noise-cancelling over-ear headphones with long battery life.",
  //   price: 199.99,
  //   imageUrl: "wireless-headphones.jpg"
  // },
  // {
  //   id: 3,
  //   name: "Smartphone",
  //   description: "Latest model smartphone with OLED display and 128GB storage.",
  //   price: 899.99,
  //   imageUrl: "smartphone.jpg"
  // },
  // {
  //   id: 4,
  //   name: "Mechanical Keyboard",
  //   description: "RGB backlit mechanical keyboard with customizable keys.",
  //   price: 129.99,
  //   imageUrl: "mechanical-keyboard.jpg"
  // },
  // {
  //   id: 5,
  //   name: 'Smartwatch',
  //   price: 249.99,
  //   imageUrl: 'smartwatch.jpg'
  // }
];

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.scss'],
  imports: [AppModule]

})

export class ProductListComponent implements OnInit {

  products: any[] = [];
  userId: string | null = null;

  // backupProducts = backupProducts;
  backupProducts = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.products = this.backupProducts;
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
      alert('You need to sign in to add products to your cart.');
      return;
    }

    this.cartService.addToCart({
      userId: Number(this.userId),
      productId: product.id,
      quantity: 1,
    }).subscribe({
      next: (res) => {
      },
      error: (err) => console.error('Error adding to cart', err)
    });
  }
}
