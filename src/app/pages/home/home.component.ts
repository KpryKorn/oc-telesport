import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { PieChartConfig } from 'src/app/core/models/PieChart';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public olympics$: Observable<Olympic[] | null> = of(null);
  subscription: Subscription = new Subscription();

  public totalCountries: number = 0;
  public totalEditions: number = 0;

  public chartConfig: PieChartConfig = {
    title: 'Médailles par pays - Jeux Olympiques',
    showLegend: true,
    legendPosition: 'bottom',
    showPercentage: false,
    height: 400,
  };

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();

    this.subscription = this.olympics$.subscribe((olympics) => {
      if (olympics && olympics.length > 0) {
        const uniqueCountries = new Set(olympics.map((o) => o.country));
        this.totalCountries = uniqueCountries.size;

        const uniqueYears = new Set();
        olympics.forEach((o) => {
          o.participations.forEach((p) => {
            uniqueYears.add(p.year);
          });

          this.totalEditions = uniqueYears.size;
        });
      } else {
        this.totalCountries = 0;
        this.totalEditions = 0;
      }
    });
  }

  getTotalNumberOfCountries(): number {
    return this.totalCountries;
  }

  getTotalNumberOfEditions(): number {
    return this.totalEditions;
  }

  // désabonnement du sub lors de la destruction du composant
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
