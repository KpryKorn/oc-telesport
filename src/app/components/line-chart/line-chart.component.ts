import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { Olympic } from 'src/app/core/models/Olympic';
import { LineChartConfig } from 'src/app/core/models/LineChart';

Chart.register(...registerables);

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('lineChart', { static: false })
  lineChart!: ElementRef<HTMLCanvasElement>;

  @Input() olympic: Olympic | null = null;
  @Input() config: LineChartConfig = {};

  private chart: Chart | undefined;

  ngAfterViewInit(): void {
    if (this.olympic) {
      this.createChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['olympic'] && !changes['olympic'].firstChange) {
      this.createChart();
    }
  }

  private createChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    if (
      !this.olympic ||
      !this.olympic.participations ||
      this.olympic.participations.length === 0
    ) {
      return;
    }

    const chartData = this.transformOlympicToChartData();

    if (chartData.length === 0) {
      return;
    }

    const labels = chartData.map((item) => item.year.toString());
    const values = chartData.map((item) => item.medals);

    const defaultConfig: LineChartConfig = {
      showLegend: true,
      legendPosition: 'top',
      showTooltips: true,
      height: 400,
      xAxisTitle: 'Années',
      yAxisTitle: 'Nombre de médailles',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      pointBackgroundColor: 'rgba(54, 162, 235, 1)',
      pointBorderColor: '#fff',
      fill: true,
      tension: 0.3,
    };

    const finalConfig = { ...defaultConfig, ...this.config };

    const chartConfig: ChartConfiguration = {
      type: 'line' as ChartType,
      data: {
        labels: labels,
        datasets: [
          {
            label: `${this.olympic.country} - Médailles`,
            data: values,
            backgroundColor: finalConfig.backgroundColor,
            borderColor: finalConfig.borderColor,
            pointBackgroundColor: finalConfig.pointBackgroundColor,
            pointBorderColor: finalConfig.pointBorderColor,
            fill: finalConfig.fill,
            tension: finalConfig.tension,
            borderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: !!finalConfig.title,
            text: finalConfig.title,
            font: {
              size: 16,
            },
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
                const year = context.label;
                const medals = context.parsed.y;
                return `${year}: ${medals} médaille${medals > 1 ? 's' : ''}`;
              },
            },
          },
        },
        scales: {
          x: {
            display: true,
            title: {
              display: !!finalConfig.xAxisTitle,
              text: finalConfig.xAxisTitle,
            },
            grid: {
              display: true,
              color: 'rgba(0, 0, 0, 0.1)',
            },
          },
          y: {
            display: true,
            title: {
              display: !!finalConfig.yAxisTitle,
              text: finalConfig.yAxisTitle,
            },
            beginAtZero: true,
            grid: {
              display: true,
              color: 'rgba(0, 0, 0, 0.1)',
            },
            ticks: {
              stepSize: 1,
            },
          },
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
      },
    };

    const ctx = this.lineChart.nativeElement.getContext('2d');
    if (ctx) {
      this.chart = new Chart(ctx, chartConfig);
    }
  }

  private transformOlympicToChartData(): {
    year: number;
    medals: number;
  }[] {
    if (!this.olympic || !this.olympic.participations) {
      return [];
    }

    return this.olympic.participations
      .map((participation) => ({
        year: participation.year,
        medals: participation.medalsCount,
      }))
      .sort((a, b) => a.year - b.year); // trier par année croissante
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
