export interface LineChartConfig {
  title?: string;
  showLegend?: boolean;
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';
  showTooltips?: boolean;
  height?: number;
  xAxisTitle?: string;
  yAxisTitle?: string;
  backgroundColor?: string;
  borderColor?: string;
  pointBackgroundColor?: string;
  pointBorderColor?: string;
  fill?: boolean;
  tension?: number;
}
