import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-country-details',
  templateUrl: './country-details.component.html',
  styleUrl: './country-details.component.scss',
})
export class CountryDetailsComponent {
  private activatedRoute = inject(ActivatedRoute);

  countryId = this.activatedRoute.snapshot.params['id'];
}
