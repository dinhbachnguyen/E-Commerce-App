import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { ProductListComponent } from './components/product-list/product-list';
import { ProductDetailComponent } from './components/product-detail/product-detail';
import { CartComponent } from './components/cart/cart';
import { CheckoutComponent } from './components/checkout/checkout';
import { LoginComponent } from './components/login/login';

export const routes: Routes = [
  { path: '', component: HomeComponent },                      // Homepage
  { path: 'products', component: ProductListComponent },       // All products
  { path: 'product/:id', component: ProductDetailComponent },  // Single product detail
  { path: 'cart', component: CartComponent },                  // Cart
  { path: 'checkout', component: CheckoutComponent },          // Checkout
  { path: 'login', component: LoginComponent },                // Login/Signup
  { path: '**', redirectTo: '' }                               // Wildcard (fallback to home)
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

