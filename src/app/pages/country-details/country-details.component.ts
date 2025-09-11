import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

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

  private olympicService = inject(OlympicService);
  private activatedRoute = inject(ActivatedRoute);

  countryId = this.activatedRoute.snapshot.params['id'];

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();

    this.susbscription = this.olympics$.subscribe((olympics) => {
      if (olympics && olympics.length > 0) {
        // les params renvoient un string => à convertir en number sinon undefined
        const countryData = olympics.find(
          (o) => o.id === Number(this.countryId)
        );
        if (countryData) {
          this.totalParticipations = countryData.participations.length;
          this.totalMedals = countryData.participations[0].medalsCount;
          this.totalAthletes = countryData.participations[0].athleteCount;
          this.countryName = countryData.country;
        } else {
          this.totalParticipations = 0;
          this.totalMedals = 0;
          this.totalAthletes = 0;
        }
      } else {
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
