import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  message: string;
  type?: 'success' | 'error' | 'info'; 
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastCounter = 0;
  private _toasts = new BehaviorSubject<Toast[]>([]);
  toasts$ = this._toasts.asObservable();

  show(message: string, type: 'success' | 'error' | 'info' = 'success', duration = 2000) {
    const id = ++this.toastCounter;
    const toast: Toast = { id, message, type };
    this._toasts.next([...this._toasts.value, toast]);

    setTimeout(() => {
      this._toasts.next(this._toasts.value.filter(t => t.id !== id));
    }, duration);
  }

  clearAll() {
    this._toasts.next([]);
  }
}
