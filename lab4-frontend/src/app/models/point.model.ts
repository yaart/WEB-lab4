export interface Point {
  id?: number;
  x: number;
  y: number;
  r: number;
  hit?: boolean;
  createdAt?: string;
  executionTime?: number;
}

export interface PointRequest {
  x: number;
  y: number;
  r: number;
}
