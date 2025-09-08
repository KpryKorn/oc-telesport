import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { PieChartConfig } from 'src/app/core/models/PieChart';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<Olympic[] | null> = of(null);

  public chartConfig: PieChartConfig = {
    title: 'Médailles par pays - Jeux Olympiques',
    showLegend: true,
    legendPosition: 'bottom',
    showPercentage: false,
    height: 400,
  };

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympicService.loadInitialData().subscribe();
    this.olympics$ = this.olympicService.getOlympics();
  }
}
