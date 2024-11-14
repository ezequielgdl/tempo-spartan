import { Component, Input, OnChanges } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';

@Component({
  selector: 'app-earnings-chart',
  standalone: true,
  imports: [
    HlmCardDirective,
    HlmCardContentDirective,
    HlmCardDescriptionDirective,
    HlmCardFooterDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    BaseChartDirective,
  ],
  template: `
    <section hlmCard>
      <div hlmCardHeader>
        <h3 hlmCardTitle class="text-sm lg:text-md">Net Earnings</h3>
        <p hlmCardDescription class="text-xs">Over the years</p>
      </div>
      <p hlmCardContent>
        <canvas
          class="bg-white p-4 rounded-lg"
          baseChart
          [data]="barChartData"
          [options]="barChartOptions"
          [type]="'bar'"
        >
        </canvas>
      </p>
    </section>
  `,
  styles: ``,
})
export class EarningsChartComponent implements OnChanges {
  @Input() earnings!: number[];
  @Input() years!: number[];
  @Input() color = 'lightblue';
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Earnings' }],
  };

  ngOnChanges(): void {
    this.barChartData = {
      labels: this.years.sort((a, b) => a - b),
      datasets: [
        {
          data: this.earnings,
          label: 'Net Earnings',
          backgroundColor: this.color,
          borderRadius: 5,
        },
      ],
    };
  }

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };
}
