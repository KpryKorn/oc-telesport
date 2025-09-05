import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<Olympic[] | null> = of(null);

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympicService.loadInitialData().subscribe();
    this.olympics$ = this.olympicService.getOlympics();
  }

  getTotalMedalsByCountry(olympics: Olympic[], country: string) {
    return olympics
      .filter((o) => o.country === country)
      .reduce((acc, curr) => {
        return (
          acc + curr.participations.reduce((sum, p) => sum + p.medalsCount, 0)
        );
      }, 0);
  }
}
