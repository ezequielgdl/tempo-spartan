import {
  Component,
  inject,
  Input,
  OnChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ThemeService } from '../../../../core/theme/theme.service';

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
        class="p-4 rounded-lg"
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

  constructor(
    private themeService: ThemeService,
    private cdr: ChangeDetectorRef
  ) {
    this.themeService.isDarkMode$.subscribe((isDark) => {
      this.updateChartOptions(isDark);
      this.cdr.markForCheck();
    });
  }

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
        grid: {
          color: '#666666', // Will be updated dynamically
        },
        pointLabels: {
          display: true,
          centerPointLabels: true,
          color: '#000000', // Will be updated dynamically
          font: {
            size: 12,
          },
        },
        ticks: {
          color: '#000000', // Will be updated dynamically
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  private updateChartOptions(isDark: boolean): void {
    const textColor = isDark ? 'white' : 'gray';
    const gridColor = isDark ? 'white' : 'gray';
    const backdropColor = isDark ? 'black' : 'white';

    this.polarAreaChartOptions = {
      ...this.polarAreaChartOptions,
      scales: {
        r: {
          ...this.polarAreaChartOptions.scales!['r'],
          grid: {
            color: gridColor,
          },
          pointLabels: {
            ...this.polarAreaChartOptions.scales!['r']?.pointLabels,
            color: textColor,
          },
          ticks: {
            color: textColor,
            backdropColor: backdropColor,
          },
        },
      },
    };
  }

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
