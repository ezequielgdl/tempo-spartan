import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
  computed,
  signal,
} from '@angular/core';
import { ClientService } from '../../clients/services/clients.service';
import { InvoicesServiceService } from '../../invoices/services/invoices-service.service';
import { QuarterlyAnalysisComponent } from '../../../shared/components/quarterly-analysis/quarterly-analysis.component';
import { Client } from '../../clients/interface';
import { Invoice } from '../../invoices/interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';

@Component({
  selector: 'app-analytics',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col items-center justify-start space-y-4 mb-4',
  },
  imports: [QuarterlyAnalysisComponent, BrnSelectImports, HlmSelectImports],
  template: `
    <brn-select
      class="inline-block"
      [placeholder]="selectedYear()?.toString() ?? 'Filter by year'"
    >
      <hlm-select-trigger>
        <hlm-select-value />
      </hlm-select-trigger>
      <hlm-select-content class="w-fit">
        @for (year of years(); track year) {
        <hlm-option
          [value]="year.toString()"
          (click)="onYearSelect(year.toString())"
        >
          {{ year }}
        </hlm-option>
        }
      </hlm-select-content>
    </brn-select>
    <section class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <app-quarterly-analysis
        [financialDataInput]="ivaAmount()"
        title="IVA"
        description="Quarterly tax breakdown"
        [selectedYear]="selectedYear()"
      ></app-quarterly-analysis>
      <app-quarterly-analysis
        [financialDataInput]="irpfAmount()"
        title="IRPF"
        description="Quarterly tax breakdown"
        [selectedYear]="selectedYear()"
      ></app-quarterly-analysis>
      <app-quarterly-analysis
        [financialDataInput]="earningsBeforeTaxes()"
        title="Earnings (gross)"
        description="Quarterly earnings breakdown before taxes"
        [selectedYear]="selectedYear()"
      ></app-quarterly-analysis>
      <app-quarterly-analysis
        [financialDataInput]="earningsAfterTaxes()"
        title="Earnings (net)"
        description="Quarterly earnings breakdown after IVA"
        [selectedYear]="selectedYear()"
      ></app-quarterly-analysis>
    </section>
  `,
  styles: ``,
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  // Signals
  protected readonly invoices = signal<Invoice[]>([]);
  protected readonly clients = signal<Client[]>([]);
  protected selectedYear = signal<string | undefined>(
    new Date().getFullYear().toString()
  );

  // Computed values
  protected readonly ivaAmount = computed(() =>
    this.invoices().map((invoice) => ({
      amount: invoice.ivaAmount,
      issueDate: invoice.issueDate,
    }))
  );

  protected readonly irpfAmount = computed(() =>
    this.invoices().map((invoice) => ({
      amount: invoice.irpfAmount,
      issueDate: invoice.issueDate,
    }))
  );

  protected readonly earningsAfterTaxes = computed(() =>
    this.invoices().map((invoice) => ({
      amount: invoice.total - invoice.ivaAmount,
      issueDate: invoice.issueDate,
    }))
  );

  protected readonly earningsBeforeTaxes = computed(() =>
    this.invoices().map((invoice) => ({
      amount: invoice.subtotal,
      issueDate: invoice.issueDate,
    }))
  );

  protected readonly years = computed(() => {
    return [
      ...new Set(
        this.invoices().map((item) => new Date(item.issueDate).getFullYear())
      ),
    ].sort((a, b) => b - a);
  });

  // Event handlers
  onYearSelect(year: string | undefined): void {
    this.selectedYear.set(year);
  }

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly invoicesService: InvoicesServiceService,
    private readonly clientsService: ClientService
  ) {}

  ngOnInit(): void {
    this.invoicesService.invoices$
      .pipe(takeUntil(this.destroy$))
      .subscribe((invoices) => {
        if (invoices && invoices.length > 0) {
          this.invoices.set(invoices);
        }
      });

    this.clientsService
      .getClients()
      .pipe(takeUntil(this.destroy$))
      .subscribe((clients) => {
        if (clients?.length > 0) {
          this.clients.set(clients);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
