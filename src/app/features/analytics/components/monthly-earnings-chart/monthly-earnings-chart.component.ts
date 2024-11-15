import { Component, Input, OnChanges } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import {
  HlmCardContentDirective,
  HlmCardDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';

@Component({
  selector: 'app-monthly-earnings-chart',
  standalone: true,
  imports: [
    BaseChartDirective,
    HlmCardDirective,
    HlmCardContentDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
  ],
  template: `
    <section hlmCard class="h-full flex flex-col">
      <div hlmCardHeader>
        <h3 hlmCardTitle class="text-sm lg:text-md">Monthly Net Earnings</h3>
        <p hlmCardDescription class="text-xs">
          {{ selectedYear }}
        </p>
      </div>
      <div hlmCardContent class="flex flex-grow items-center justify-center">
        <canvas
          class="bg-white p-4 rounded-lg h-full w-full"
          baseChart
          [data]="lineChartData"
          [options]="lineChartOptions"
          [type]="'line'"
        ></canvas>
      </div>
    </section>
  `,
  styles: [],
})
export class MonthlyEarningsChartComponent implements OnChanges {
  @Input() monthlyEarnings!: number[];
  @Input() selectedYear!: string | undefined;
  months: string[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  };

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  ngOnChanges(): void {
    this.lineChartData = {
      labels: this.months,
      datasets: [
        {
          data: this.monthlyEarnings,
          label: 'Earnings',
          fill: true,
          tension: 0.1,
        },
      ],
    };
  }
}
