import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { LineChartConfig } from 'src/app/core/models/LineChart';

@Component({
  selector: 'app-country-details',
  templateUrl: './country-details.component.html',
  styleUrl: './country-details.component.scss',
})
export class CountryDetailsComponent implements OnInit, OnDestroy {
  public olympics$: Observable<Olympic[] | null> = of(null);
  susbscription: Subscription = new Subscription();

  public totalParticipations: number = 0;
  public totalMedals: number = 0;
  public totalAthletes: number = 0;
  public countryName: string = '';
  public countryData: Olympic | null = null;

  public lineChartConfig: LineChartConfig = {
    height: 500,
    showLegend: true,
    legendPosition: 'top',
    xAxisTitle: 'Années',
    yAxisTitle: 'Nombre de médailles',
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    borderColor: 'rgba(75, 192, 192, 1)',
    pointBackgroundColor: 'rgba(75, 192, 192, 1)',
    pointBorderColor: '#fff',
    fill: true,
    tension: 0.4,
  };

  private olympicService = inject(OlympicService);
  private activatedRoute = inject(ActivatedRoute);

  countryId = this.activatedRoute.snapshot.params['id'];

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();

    this.susbscription = this.olympics$.subscribe((olympics) => {
      if (olympics && olympics.length > 0) {
        // les params renvoient un string => à convertir en number sinon undefined
        const currentCountryData = olympics.find(
          (o) => o.id === Number(this.countryId)
        );
        if (currentCountryData) {
          this.countryData = currentCountryData;
          this.totalParticipations = currentCountryData.participations.length;
          this.totalMedals = currentCountryData.participations.reduce(
            (sum, participation) => sum + participation.medalsCount,
            0
          );
          this.totalAthletes = currentCountryData.participations.reduce(
            (sum, participation) => sum + participation.athleteCount,
            0
          );
          this.countryName = currentCountryData.country;
        } else {
          this.countryData = null;
          this.totalParticipations = 0;
          this.totalMedals = 0;
          this.totalAthletes = 0;
        }
      } else {
        this.countryData = null;
        this.totalParticipations = 0;
        this.totalMedals = 0;
        this.totalAthletes = 0;
      }
    });
  }

  ngOnDestroy(): void {
    this.susbscription.unsubscribe();
  }
}
