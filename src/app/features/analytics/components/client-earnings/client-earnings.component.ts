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
  selector: 'app-client-earnings',
  standalone: true,
  imports: [
    HlmCardDirective,
    HlmCardContentDirective,
    HlmCardDescriptionDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    BaseChartDirective,
  ],
  template: ` <section hlmCard>
    <div hlmCardHeader>
      <h3 hlmCardTitle class="text-sm lg:text-md">Client Earnings</h3>
      <p hlmCardDescription class="text-xs">Distribution by client</p>
    </div>
    <p hlmCardContent>
      <canvas
        class="bg-white p-4 rounded-lg"
        baseChart
        [data]="polarAreaChartData"
        [options]="polarAreaChartOptions"
        [type]="'polarArea'"
      >
      </canvas>
    </p>
  </section>`,
  styles: ``,
})
export class ClientEarningsComponent implements OnChanges {
  @Input() clientEarnings: { client: string; earnings: number }[] = [];

  polarAreaChartData: ChartData<'polarArea'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Client Earnings',
      },
    ],
  };

  polarAreaChartOptions: ChartOptions<'polarArea'> = {
    responsive: true,
    scales: {
      r: {
        pointLabels: {
          display: true,
          centerPointLabels: true,
          font: {
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  ngOnChanges(): void {
    this.polarAreaChartData = {
      labels: this.clientEarnings.map((item) => item.client),
      datasets: [
        {
          data: this.clientEarnings.map((item) => item.earnings),
          label: 'Client Earnings',
        },
      ],
    };
  }
}
