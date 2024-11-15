import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Input,
  signal,
  SimpleChanges,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
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

interface FinancialData {
  amount: number;
  issueDate: string;
}

@Component({
  selector: 'app-quarterly-analysis',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HlmCardDirective,
    HlmCardContentDirective,
    HlmCardDescriptionDirective,
    HlmCardFooterDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    BrnSelectImports,
    HlmSelectImports,
    CurrencyPipe,
  ],
  template: `
    <section hlmCard>
      <div hlmCardHeader class="pt-4 pb-2">
        <h3 hlmCardTitle class="text-sm lg:text-md">{{ title }}</h3>
        <!-- <p hlmCardDescription>{{ description }}</p> -->
      </div>
      <div hlmCardContent>
        <div class="flex items-center justify-end mb-3">
          <div class="text-right">
            <div class="text-xs text-muted-foreground">Annual Total</div>
            <div class="text-sm lg:text-md font-semibold" [class]="textColor">
              {{ annualTotal() | currency : 'EUR' }}
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          @for (quarter of quarters; track quarter.id) {
          <div class="p-2 rounded-lg bg-muted">
            <div class="text-xs text-muted-foreground">{{ quarter.label }}</div>
            <div class="text-sm xl:text-md font-semibold mt-1">
              {{ quarter.value() | currency : 'EUR' }}
            </div>
          </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: ``,
})
export class QuarterlyAnalysisComponent {
  // Inputs
  @Input() financialDataInput: FinancialData[] = [];
  @Input() title = '';
  @Input() description = '';
  @Input() selectedYear: string | undefined;
  @Input() textColor = 'text-white';

  // Protected signals
  protected financialData = signal<FinancialData[]>([], {
    equal: (a, b) =>
      a.length === b.length &&
      a.every(
        (item, i) =>
          item.amount === b[i].amount && item.issueDate === b[i].issueDate
      ),
  });

  protected readonly selectedYearSignal = signal<string | undefined>(
    new Date().getFullYear().toString()
  );

  protected readonly filteredFinancialData = computed(() => {
    return this.financialData().filter(
      (item) =>
        new Date(item.issueDate).getFullYear() ===
        Number(this.selectedYearSignal())
    );
  });

  private getTrimesterAmount(startMonth: number, endMonth?: number) {
    return computed(() => {
      return this.filteredFinancialData()
        .filter((item) => {
          const month = new Date(item.issueDate).getMonth();
          return endMonth
            ? month >= startMonth && month < endMonth
            : month >= startMonth;
        })
        .reduce((sum, item) => sum + item.amount, 0);
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

  protected readonly annualTotal = computed(() => {
    return this.filteredFinancialData().reduce(
      (sum, item) => sum + item.amount,
      0
    );
  });

  // Lifecycle hooks
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['financialDataInput']) {
      this.financialData.set(changes['financialDataInput'].currentValue);
    }
    if (changes['selectedYear']) {
      this.selectedYearSignal.set(changes['selectedYear'].currentValue);
    }
  }
}
