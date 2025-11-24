import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { AppModule } from '../../app.module';

@Component({
  selector: 'app-auth',
  imports: [AppModule],
  templateUrl: './auth.html',
  styleUrls: ['./auth.scss']
})
export class AuthComponent implements OnInit {
  authForm!: FormGroup;
  isLoginMode = true; // toggle between login and register

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  submit() {
    if (this.authForm.invalid) return;

    if (this.isLoginMode) {
      // Login
      this.authService.login(this.authForm.value).subscribe({
        next: (res: any) => {
          this.authService.saveToken(res.token);
          window.location.href = '/';
        },
        error: err => alert(err.error || 'Login failed')
      });
    } else {
      // Register
      this.authService.register(this.authForm.value).subscribe({
        next: () => {
          alert('Registration successful! Please login.');
          this.isLoginMode = true;
        },
        error: err => {
          alert(err.error?.message || 'Registration failed');
        }
      });
    }
  }
}
