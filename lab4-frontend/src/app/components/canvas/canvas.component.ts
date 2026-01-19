import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
  HostListener
} from '@angular/core';
import { Point } from '../../models/point.model';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() points: Point[] = [];
  @Input() currentR: number = 2;
  @Output() canvasClick = new EventEmitter<{ x: number; y: number }>();

  canvasSize = 400;
  private ctx!: CanvasRenderingContext2D;
  private scale = 40;

  @HostListener('window:resize')
  onResize() {
    this.draw();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.draw();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.ctx) {
      this.draw();
    }
  }

  private draw(): void {
    const ctx = this.ctx;
    const size = this.canvasSize;
    const center = size / 2;
    const r = this.currentR;
    const scale = this.scale;

    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    if (r > 0) {
      ctx.fillStyle = 'rgba(102, 126, 234, 0.4)';

      ctx.fillRect(
        center - r * scale,
        center,
        r * scale,
        (r / 2) * scale
      );

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.lineTo(center + (r / 2) * scale, center);
      ctx.lineTo(center, center - r * scale);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, r * scale, 0, Math.PI / 2, false);
      ctx.closePath();
      ctx.fill();
    }

    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    for (let i = -4; i <= 4; i++) {
      ctx.beginPath();
      ctx.moveTo(center + i * scale, 0);
      ctx.lineTo(center + i * scale, size);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, center + i * scale);
      ctx.lineTo(size, center + i * scale);
      ctx.stroke();
    }

    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, center);
    ctx.lineTo(size, center);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(center, 0);
    ctx.lineTo(center, size);
    ctx.stroke();

    ctx.fillStyle = '#374151';

    ctx.beginPath();
    ctx.moveTo(size - 10, center - 5);
    ctx.lineTo(size, center);
    ctx.lineTo(size - 10, center + 5);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(center - 5, 10);
    ctx.lineTo(center, 0);
    ctx.lineTo(center + 5, 10);
    ctx.fill();

    ctx.fillStyle = '#374151';
    ctx.font = '14px Arial';
    ctx.fillText('X', size - 15, center - 10);
    ctx.fillText('Y', center + 10, 15);

    if (r > 0) {
      ctx.fillStyle = '#6b7280';
      ctx.font = '11px Arial';

      ctx.fillText('R', center + r * scale - 8, center - 8);
      ctx.fillText('R/2', center + (r / 2) * scale - 12, center - 8);
      ctx.fillText('-R', center - r * scale - 2, center - 8);
      ctx.fillText('-R/2', center - (r / 2) * scale - 18, center - 8);

      ctx.fillText('R', center + 8, center - r * scale + 4);
      ctx.fillText('R/2', center + 8, center - (r / 2) * scale + 4);
      ctx.fillText('-R', center + 8, center + r * scale + 4);
      ctx.fillText('-R/2', center + 8, center + (r / 2) * scale + 4);
    }

    this.points.forEach(point => {
      const px = center + point.x * scale;
      const py = center - point.y * scale;

      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fillStyle = point.hit ? '#22c55e' : '#ef4444';
      ctx.fill();
      ctx.strokeStyle = point.hit ? '#16a34a' : '#dc2626';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }

  handleClick(event: MouseEvent): void {

    if (this.currentR <= 0) {
      return;
    }

    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();

    const cssToCanvasX = canvas.width / rect.width;
    const cssToCanvasY = canvas.height / rect.height;

    const canvasX = (event.clientX - rect.left) * cssToCanvasX;
    const canvasY = (event.clientY - rect.top) * cssToCanvasY;

    console.log('Click coordinates:', {
      clientX: event.clientX,
      clientY: event.clientY,
      rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
      canvasSize: { width: canvas.width, height: canvas.height },
      cssToCanvas: { x: cssToCanvasX, y: cssToCanvasY },
      canvasX: canvasX,
      canvasY: canvasY
    });

    if (canvasX < 0 || canvasX > canvas.width || canvasY < 0 || canvasY > canvas.height) {
      console.log('Click outside canvas bounds');
      return;
    }

    const center = this.canvasSize / 2;

    let x = (canvasX - center) / this.scale;
    let y = (center - canvasY) / this.scale;

    const validXValues = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
    let roundedX = x;

    let minDiff = Infinity;
    let nearestX = validXValues[0];

    for (const validX of validXValues) {
      const diff = Math.abs(x - validX);
      if (diff < minDiff) {
        minDiff = diff;
        nearestX = validX;
      }
    }

    roundedX = nearestX;

    const roundedY = Math.round(y * 100) / 100;

    const clampedY = Math.max(-3, Math.min(5, roundedY));

    console.log('Graph coordinates:', {
      originalX: x,
      originalY: y,
      roundedX: roundedX,
      roundedY: roundedY,
      clampedY: clampedY
    });

    console.log('Emitting canvasClick event');
    this.canvasClick.emit({ x: roundedX, y: clampedY });

    console.log('=== CANVAS CLICK END ===');
  }

  drawCrosshair(x: number, y: number): void {
    if (!this.ctx) return;

    const center = this.canvasSize / 2;
    const px = center + x * this.scale;
    const py = center - y * this.scale;

    this.ctx.strokeStyle = '#0000FF';
    this.ctx.lineWidth = 1;

    this.ctx.beginPath();
    this.ctx.moveTo(px - 10, py);
    this.ctx.lineTo(px + 10, py);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(px, py - 10);
    this.ctx.lineTo(px, py + 10);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.arc(px, py, 3, 0, Math.PI * 2);
    this.ctx.fillStyle = '#0000FF';
    this.ctx.fill();
  }

  testClick(testX: number, testY: number): void {
    console.log('=== TEST CLICK ===');
    console.log('Test coordinates:', { x: testX, y: testY });
    console.log('Current R:', this.currentR);

    if (this.currentR <= 0) {
      console.log('R <= 0, cannot test');
      return;
    }


    this.drawCrosshair(testX, testY);

    this.canvasClick.emit({ x: testX, y: testY });
    console.log('Test click emitted');
  }

  mouseX: number | null = null;
  mouseY: number | null = null;

  onMouseMove(event: MouseEvent): void {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();

    const cssToCanvasX = canvas.width / rect.width;
    const cssToCanvasY = canvas.height / rect.height;

    const canvasX = (event.clientX - rect.left) * cssToCanvasX;
    const canvasY = (event.clientY - rect.top) * cssToCanvasY;

    const center = this.canvasSize / 2;

    if (canvasX >= 0 && canvasX <= canvas.width &&
      canvasY >= 0 && canvasY <= canvas.height) {
      this.mouseX = (canvasX - center) / this.scale;
      this.mouseY = (center - canvasY) / this.scale;
    } else {
      this.mouseX = null;
      this.mouseY = null;
    }
  }
}
