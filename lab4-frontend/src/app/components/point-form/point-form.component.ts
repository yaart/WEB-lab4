import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { PointService } from '../../services/point.service';
import { Point } from '../../models/point.model';

@Component({
  selector: 'app-point-form',
  templateUrl: './point-form.component.html',
  styleUrls: ['./point-form.component.scss']
})
export class PointFormComponent implements OnInit {
  @Input() currentR: number = 2;
  @Output() pointSubmitted = new EventEmitter<Point>();
  @Output() rChanged = new EventEmitter<number>();

  xValues: number[] = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
  rValues: number[] = [-4, -3, -2, -1, 0, 1, 2, 3, 4];

  selectedXValues: number[] = [];
  selectedRValues: number[] = [];
  yValue: number = 0;

  loading = false;

  constructor(
    private pointService: PointService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    if (this.currentR > 0) {
      this.selectedRValues = [this.currentR];
    }
  }

  get selectedX(): number | null {
    return this.selectedXValues.length > 0 ? this.selectedXValues[0] : null;
  }

  get selectedR(): number | null {
    return this.selectedRValues.length > 0 ? this.selectedRValues[0] : null;
  }

  onXChange(): void {
    if (this.selectedXValues.length > 1) {
      this.selectedXValues = [this.selectedXValues[this.selectedXValues.length - 1]];
    }
  }

  onRChange(): void {
    if (this.selectedRValues.length > 1) {
      this.selectedRValues = [this.selectedRValues[this.selectedRValues.length - 1]];
    }

    // Фильтруем только положительные
    this.selectedRValues = this.selectedRValues.filter(r => r > 0);

    if (this.selectedR !== null && this.selectedR > 0) {
      this.rChanged.emit(this.selectedR);
    }
  }

  isFormValid(): boolean {
    const xValid = this.selectedX !== null &&
      [-4, -3, -2, -1, 0, 1, 2, 3, 4].includes(this.selectedX);
    const rValid = this.selectedR !== null &&
      this.selectedR > 0 &&
      [1, 2, 3, 4].includes(this.selectedR); // Только положительные
    const yValid = this.yValue >= -3 && this.yValue <= 5;

    return xValid && rValid && yValid;
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      let errors = [];

      if (!this.selectedX) errors.push('Выберите координату X');
      if (!this.selectedR || this.selectedR <= 0) errors.push('Выберите положительный радиус R');
      if (this.yValue < -3 || this.yValue > 5) errors.push('Y должен быть от -3 до 5');

      this.messageService.add({
        severity: 'error',
        summary: 'Ошибка валидации',
        detail: errors.join(', ')
      });
      return;
    }

    this.loading = true;

    const request = {
      x: this.selectedX!,
      y: parseFloat(this.yValue.toFixed(2)),
      r: this.selectedR!
    };

    this.pointService.checkPoint(request).subscribe({
      next: (point) => {
        this.loading = false;
        this.messageService.add({
          severity: point.hit ? 'success' : 'warn',
          summary: point.hit ? 'Попадание!' : 'Промах',
          detail: `Точка (${point.x}, ${point.y.toFixed(2)}) ${point.hit ? 'попала' : 'не попала'} в область при R=${point.r}`
        });
        this.pointSubmitted.emit(point);
      },
      error: (error) => {
        this.loading = false;
        const message = error.error?.message ||
          error.error?.messages?.[0] ||
          'Не удалось проверить точку';
        this.messageService.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: message
        });
      }
    });
  }
}
