import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';

  private olympics$ = new BehaviorSubject<Olympic | null>(null);
  private loading$ = new BehaviorSubject<boolean>(false);
  private error$ = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {}

  loadInitialData(): Observable<Olympic> {
    this.loading$.next(true);
    this.error$.next(null);

    return this.http.get<Olympic>(this.olympicUrl).pipe(
      tap((value) => {
        this.olympics$.next(value);
        this.loading$.next(false);
      }),
      catchError((error) => {
        this.error$.next('Failed to load Olympic data');
        this.loading$.next(false);
        this.olympics$.next(null);
        throw error;
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }
}
