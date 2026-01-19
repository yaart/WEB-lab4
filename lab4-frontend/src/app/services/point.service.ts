import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, BehaviorSubject, tap, throwError} from 'rxjs';
import { Point, PointRequest } from '../models/point.model';
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PointService {
  private readonly API_URL = 'http://localhost:8080/api/points';

  private pointsSubject = new BehaviorSubject<Point[]>([]);
  public points$ = this.pointsSubject.asObservable();

  constructor(private http: HttpClient) {}

  checkPoint(request: PointRequest): Observable<Point> {


    return this.http.post<Point>(`${this.API_URL}/check`, request)
      .pipe(
        tap(point => {
          console.log('Point:', point);
          const currentPoints = this.pointsSubject.value;
          this.pointsSubject.next([point, ...currentPoints]);
        }),
        catchError(error => {
          console.error('Full error:', error);
          return throwError(() => error);
        })
      );
  }

  loadPoints(): Observable<Point[]> {
    return this.http.get<Point[]>(this.API_URL)
      .pipe(
        tap(points => this.pointsSubject.next(points))
      );
  }

  clearPoints(): Observable<any> {
    return this.http.delete(this.API_URL)
      .pipe(
        tap(() => this.pointsSubject.next([]))
      );
  }

  getPoints(): Point[] {
    return this.pointsSubject.value;
  }
}
