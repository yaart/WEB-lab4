import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Point } from '../../models/point.model';

@Component({
  selector: 'app-points-table',
  templateUrl: './points-table.component.html',
  styleUrls: ['./points-table.component.scss']
})
export class PointsTableComponent {
  @Input() points: Point[] = [];
  @Output() clearRequested = new EventEmitter<void>();

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  confirmClear(): void {
    this.confirmationService.confirm({
      message: 'Вы уверены, что хотите удалить все точки?',
      header: 'Подтверждение удаления',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Да, удалить',
      rejectLabel: 'Отмена',
      accept: () => {
        this.clearRequested.emit();
        this.messageService.add({
          severity: 'info',
          summary: 'Очищено',
          detail: 'Все точки удалены'
        });
      }
    });
  }

  formatDate(dateStr: string | undefined): string {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleString('ru-RU');
  }

  formatY(y: number): string {
    return y.toFixed(2);
  }
}
