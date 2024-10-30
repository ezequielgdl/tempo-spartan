import { CurrencyPipe, JsonPipe } from '@angular/common';
import { Component, computed, Input, signal, SimpleChanges } from '@angular/core';
import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';

interface IvaData {
  ivaAmount: number;
  issueDate: string;
}

@Component({
  selector: 'app-iva-analysis',
  standalone: true,
  imports: [
    HlmCardDirective,
    HlmCardContentDirective,
    HlmCardDescriptionDirective,
    HlmCardFooterDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    BrnSelectImports,
    HlmSelectImports,
    JsonPipe,
    CurrencyPipe
  ],
  template: `
    <section hlmCard class="w-fit m-4">
      <div hlmCardHeader>
        <h3 hlmCardTitle>IVA Analysis</h3>
        <p hlmCardDescription>Quarterly tax breakdown</p>
      </div>
      <div hlmCardContent>
        <brn-select class="mb-4 inline-block" [placeholder]="selectedYear()?.toString() ?? 'Filter by year'">
          <hlm-select-trigger>
            <hlm-select-value />
          </hlm-select-trigger>
          <hlm-select-content class="min-w-48">
            @for (year of years(); track year) {
              <hlm-option [value]="year.toString()" (click)="onYearSelect(year.toString())">
                {{ year }}
              </hlm-option>
            }
          </hlm-select-content>
        </brn-select>

        <div class="grid grid-cols-2 gap-4">
          @for (quarter of quarters; track quarter.id) {
            <div class="p-4 rounded-lg bg-muted">
              <div class="text-sm text-muted-foreground">{{ quarter.label }}</div>
              <div class="text-xl font-semibold mt-1">
                {{ quarter.value() | currency:'EUR' }}
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: ``
})
export class IvaAnalysisComponent {
  // Inputs
  @Input() ivaAmount: IvaData[] = [];

  // Protected signals
  protected ivaData = signal<IvaData[]>([], { equal: (a, b) => 
    a.length === b.length && 
    a.every((item, i) => item.ivaAmount === b[i].ivaAmount && item.issueDate === b[i].issueDate) 
  });
  protected selectedYear = signal<string | undefined>(new Date().getFullYear().toString());

  // Computed values
  protected readonly years = computed(() => {
    return [...new Set(
      this.ivaData().map(item => new Date(item.issueDate).getFullYear())
    )].sort((a, b) => b - a);
  });

  protected readonly filteredIvaData = computed(() => {
    return this.ivaData().filter(item => 
      new Date(item.issueDate).getFullYear() === Number(this.selectedYear())
    );
  });

  private getTrimesterAmount(startMonth: number, endMonth?: number) {
    return computed(() => {
      return this.filteredIvaData()
        .filter(item => {
          const month = new Date(item.issueDate).getMonth();
          return endMonth 
            ? month >= startMonth && month < endMonth
            : month >= startMonth;
        })
        .reduce((sum, item) => sum + item.ivaAmount, 0);
    });
  }

  protected readonly trimester1 = this.getTrimesterAmount(0, 3);
  protected readonly trimester2 = this.getTrimesterAmount(3, 6);
  protected readonly trimester3 = this.getTrimesterAmount(6, 9);
  protected readonly trimester4 = this.getTrimesterAmount(9);

  protected readonly quarters = [
    { id: 1, label: 'Q1 (Jan - Mar)', value: this.trimester1 },
    { id: 2, label: 'Q2 (Apr - Jun)', value: this.trimester2 },
    { id: 3, label: 'Q3 (Jul - Sep)', value: this.trimester3 },
    { id: 4, label: 'Q4 (Oct - Dec)', value: this.trimester4 },
  ];

  // Lifecycle hooks
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ivaAmount']) {
      this.ivaData.set(changes['ivaAmount'].currentValue);
    }
  }

  // Event handlers
  onYearSelect(year: string | undefined): void {
    this.selectedYear.set(year);
  }
}
