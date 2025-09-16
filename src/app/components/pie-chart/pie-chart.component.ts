import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { Olympic } from 'src/app/core/models/Olympic';
import { PieChartConfig } from 'src/app/core/models/PieChart';

Chart.register(...registerables);

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('pieChart', { static: false })
  pieChart!: ElementRef<HTMLCanvasElement>;

  router = inject(Router);

  @Input() olympics: Olympic[] = [];
  @Input() config: PieChartConfig = {};

  private chart: Chart | undefined;

  private defaultColors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7',
    '#DDA0DD',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
  ];

  ngAfterViewInit(): void {
    if (this.olympics && this.olympics.length > 0) {
      this.createChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['olympics'] && !changes['olympics'].firstChange) {
      this.createChart();
    }
  }

  private createChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    if (!this.olympics || this.olympics.length === 0) {
      return;
    }

    const chartData = this.transformOlympicsToChartData();

    if (chartData.length === 0) {
      return;
    }

    const labels = chartData.map((item) => item.country);
    const values = chartData.map((item) => item.totalMedals);
    const colors = chartData.map(
      (item, index) => this.defaultColors[index % this.defaultColors.length]
    );

    const defaultConfig: PieChartConfig = {
      title: 'Graphique en secteurs',
      showLegend: true,
      legendPosition: 'bottom',
      showTooltips: true,
      showPercentage: false,
      height: 400,
    };

    const finalConfig = { ...defaultConfig, ...this.config };

    const chartConfig: ChartConfiguration = {
      type: 'pie' as ChartType,
      data: {
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors,
            borderWidth: 2,
            borderColor: '#fff',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (event, elements) => {
          if (elements != undefined && elements.length > 0) {
            this.navigateOnClick(chartData[elements[0].index].country);
          }
        },
        plugins: {
          title: {
            display: !!finalConfig.title,
            text: finalConfig.title,
          },
          legend: {
            display: finalConfig.showLegend,
            position: finalConfig.legendPosition,
            labels: {
              padding: 20,
              usePointStyle: true,
            },
          },
          tooltip: {
            enabled: finalConfig.showTooltips,
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed;

                return `${label}: ${value} médailles`;
              },
            },
          },
        },
      },
    };

    const ctx = this.pieChart.nativeElement.getContext('2d');
    if (ctx) {
      this.chart = new Chart(ctx, chartConfig);
    }
  }

  private transformOlympicsToChartData(): {
    country: string;
    totalMedals: number;
  }[] {
    const countries = [...new Set(this.olympics.map((o) => o.country))];

    return countries
      .map((country) => ({
        country,
        totalMedals: this.getTotalMedalsByCountry(country),
      }))
      .filter((item) => item.totalMedals > 0);
  }

  private getTotalMedalsByCountry(country: string): number {
    return this.olympics
      .filter((o) => o.country === country)
      .reduce((acc, curr) => {
        return (
          acc + curr.participations.reduce((sum, p) => sum + p.medalsCount, 0)
        );
      }, 0);
  }

  navigateOnClick(country: string) {
    const olympic = this.olympics.find((o) => o.country === country);
    if (olympic) {
      this.router.navigate(['/details', olympic.id]);
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
