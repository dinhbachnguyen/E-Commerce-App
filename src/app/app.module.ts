import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { BrowserModule } from '@angular/platform-browser';
// import { AppRoutingModule, routes } from './app.routes';
import { HttpClient, HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [],
  imports: [],
  exports: [CommonModule,
            ReactiveFormsModule,
            RouterModule,
            FormsModule,
            // BrowserModule,
            // HttpClientModule,
            // RouterModule.forRoot(routes)
          
            
  ]
})
export class AppModule {}
