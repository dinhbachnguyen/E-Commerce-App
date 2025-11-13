import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + "/api/auth"
  private loggedIn = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    this.loggedIn.next(!!token);
  }

  // Login user
  login(email: string, password: string): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(res => {
          localStorage.setItem('token', res.token);
          this.loggedIn.next(true);
        })
      );
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
  }

  // Get JWT token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Check if user is logged in
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // Optional: add headers with token
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
}

