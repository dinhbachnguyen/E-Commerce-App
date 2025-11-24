import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService, CartOrder } from '../../services/cart/cart.service';
import { HttpClient } from '@angular/common/http';
import { AppModule } from '../../app.module';

@Component({
  selector: 'app-checkout',
  imports: [AppModule], 
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.scss']
})
export class CheckoutComponent implements OnInit {

  checkoutForm!: FormGroup;
  cartItems: CartOrder[] = [];
  total = 0;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Initialize reactive form
    this.checkoutForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
    });

    // Get cart items
    // this.cartService.cartItems$.subscribe(items => {
    //   this.cartItems = items;
    //   this.total = this.cartService.getTotal();
    // });
  }

  submitOrder() {
    if (this.checkoutForm.invalid) {
      alert('Please fill in all required fields');
      return;
    }

    const orderPayload = {
      customer: this.checkoutForm.value,
      items: this.cartItems,
      total: this.total
    };

    // Replace with your actual API URL
    this.http.post('https://localhost:/api/order', orderPayload)
      .subscribe({
        next: (response) => {
          alert('Order placed successfully!');
          // this.cartService.clearCart(); // Clear cart after successful order
          this.checkoutForm.reset();
        },
        error: (err) => {
          console.error(err);
          alert('Failed to place order.');
        }
      });
  }
}
