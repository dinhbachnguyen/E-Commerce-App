import { Component } from '@angular/core';
import { ToastService, Toast } from '../../services/toast/toast.service';
import { AppModule } from '../../app.module';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.html',
  styleUrls: ['./toast.scss'],
  imports: [AppModule]
})
export class ToastsComponent {
  toasts: Toast[] = [];

  constructor(public toastService: ToastService) {
    this.toastService.toasts$.subscribe(toasts => this.toasts = toasts);
  }
}
