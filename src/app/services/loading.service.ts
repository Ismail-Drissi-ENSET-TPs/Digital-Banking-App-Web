import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private requestCount = 0;

  constructor() {}

  get loading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  get isLoading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  get isLoading(): boolean {
    return this.loadingSubject.value;
  }

  show(): void {
    this.requestCount++;
    if (this.requestCount === 1) {
      this.loadingSubject.next(true);
    }
  }

  hide(): void {
    this.requestCount = Math.max(0, this.requestCount - 1);
    if (this.requestCount === 0) {
      this.loadingSubject.next(false);
    }
  }

  forceHide(): void {
    this.requestCount = 0;
    this.loadingSubject.next(false);
  }
}
