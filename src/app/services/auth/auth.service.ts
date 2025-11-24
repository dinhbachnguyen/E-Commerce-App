import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + "/api/auth"

  private usernameSubject = new BehaviorSubject<string | null>(this.getUsername());
  username$ = this.usernameSubject.asObservable();

  private userIdSubject = new BehaviorSubject<string | null>(this.getUserId());
  userId$ = this.userIdSubject.asObservable();

  constructor(private http: HttpClient) { }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: any) {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    this.usernameSubject.next(null);
    this.userIdSubject.next(null);
    window.location.href = '/auth';
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);

    const payload = JSON.parse(atob(token.split('.')[1]));
    const email = payload['sub'];
    const username = email.split('@')[0];
    const userId = payload['id'];
    localStorage.setItem('username', username);
    localStorage.setItem('userId', userId);
    this.usernameSubject.next(username);
    this.userIdSubject.next(userId);

  }
  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  getUsername() {
    return localStorage.getItem('username');
  }

  getUserId() {
    return localStorage.getItem('userId');
  }
}

