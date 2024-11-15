import { ChangeDetectorRef, Component, Input, OnChanges } from '@angular/core';
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
    <section hlmCard class="h-full flex flex-col">
      <div hlmCardHeader>
        <h3 hlmCardTitle class="text-sm lg:text-md">Net Earnings</h3>
        <p hlmCardDescription class="text-xs">Over the years</p>
      </div>
      <p hlmCardContent class="flex flex-grow items-center justify-center">
        <canvas
          class="p-4 rounded-lg h-full w-full"
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

  constructor(
    private themeService: ThemeService,
    private cdr: ChangeDetectorRef
  ) {
    this.themeService.isDarkMode$.subscribe((isDark) => {
      this.updateChartOptions(isDark);
      this.cdr.markForCheck();
    });
  }

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
    indexAxis: 'y',
    scales: {
      x: {
        grid: {
          color: 'rgba(211, 211, 211, 0.25)', // Default grid color
        },
        ticks: {
          color: 'gray', // Default text color
        },
      },
      y: {
        grid: {
          color: 'rgba(211, 211, 211, 0.25)',
        },
        ticks: {
          color: 'gray',
        },
      },
    },
  };

  private updateChartOptions(isDark: boolean): void {
    const textColor = isDark ? 'white' : 'gray';
    const gridColor = isDark
      ? 'rgba(255, 255, 255, 0.25)'
      : 'rgba(211, 211, 211, 0.25)';

    this.barChartOptions = {
      ...this.barChartOptions,
      scales: {
        x: {
          grid: {
            color: gridColor,
          },
          ticks: {
            color: textColor,
          },
        },
        y: {
          grid: {
            color: gridColor,
          },
          ticks: {
            color: textColor,
          },
        },
      },
    };
  }
}
