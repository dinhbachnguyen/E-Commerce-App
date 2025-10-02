import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { AppModule } from '../../app.module';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  imports: [AppModule],
  standalone: true

})
export class HomeComponent implements OnInit {

  featuredProducts: any[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    // Load featured products (can filter by a "featured" property or just top products)
    // this.productService.getProducts().subscribe(products => {
    //   this.featuredProducts = products.slice(0, 4); // Example: top 4 products
    // });
  }

}
