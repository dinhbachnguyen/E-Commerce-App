import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import { AppModule } from './app.module';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, AppModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true
})
export class App {
  protected readonly title = signal('ecommerce-frontend');

  username: string | null = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(username => {
      this.username = username;
    });
  }

  logout() {
    if (confirm("Are you sure you want to log out?")) {
      this.authService.logout();
    }
  }
}
