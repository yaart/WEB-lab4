import { Component, OnInit } from '@angular/core';
import { PointService } from '../../services/point.service';
import { Point } from '../../models/point.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  points: Point[] = [];
  currentR: number = 2;

  constructor(
    private pointService: PointService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadPoints();
  }

  loadPoints(): void {
    this.pointService.loadPoints().subscribe({
      next: (points) => {
        this.points = points;
      },
      error: (err) => {
        console.error('Failed to load points', err);
      }
    });
  }

  onRChanged(r: number): void {
    this.currentR = r;
  }

  onCanvasClick(coords: { x: number; y: number }): void {


    if (this.currentR <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Внимание',
        detail: 'Выберите положительный радиус R'
      });
      return;
    }

    console.log('Sending to point service:', {
      x: coords.x,
      y: coords.y,
      r: this.currentR
    });

    this.pointService.checkPoint({
      x: coords.x,
      y: coords.y,
      r: this.currentR
    }).subscribe({
      next: (point) => {
        console.log('Point received:', point);
        this.points = [point, ...this.points];
        this.messageService.add({
          severity: point.hit ? 'success' : 'warn',
          summary: point.hit ? 'Попадание!' : 'Промах',
          detail: `Точка (${point.x.toFixed(2)}, ${point.y.toFixed(2)})`
        });
      },
      error: (err) => {
        console.error('Error details:', err);
        console.error('Error status:', err.status);
        console.error('Error message:', err.message);
        console.error('Error response:', err.error);

        this.messageService.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: err.error?.message || err.error?.messages?.[0] || 'Не удалось проверить точку'
        });
      }
    });
  }

  onPointAdded(point: Point): void {
    this.points = [point, ...this.points];
  }

  onClearPoints(): void {
    this.pointService.clearPoints().subscribe({
      next: () => {
        this.points = [];
      }
    });
  }

}
