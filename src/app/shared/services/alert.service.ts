import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private msg = inject(MessageService);

  error(summary: string, detail?: string, life = 5000) {
    this.msg.add({ severity: 'error', summary, detail, life });
  }

  success(summary: string, detail?: string, life = 3000) {
    this.msg.add({ severity: 'success', summary, detail, life });
  }

  warn(summary: string, detail?: string, life = 4000) {
    this.msg.add({ severity: 'warn', summary, detail, life });
  }

  info(summary: string, detail?: string, life = 3000) {
    this.msg.add({ severity: 'info', summary, detail, life });
  }
}
