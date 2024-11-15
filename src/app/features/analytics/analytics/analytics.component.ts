import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
  computed,
  signal,
  inject,
} from '@angular/core';
import { ClientService } from '../../clients/services/clients.service';
import { InvoicesServiceService } from '../../invoices/services/invoices-service.service';
import { QuarterlyAnalysisComponent } from '../components/quarterly-analysis/quarterly-analysis.component';
import { NetEarningsChartComponent } from '../components/net-earnings-chart/net-earnings-chart.component';
import { ClientEarningsComponent } from '../components/client-earnings/client-earnings.component';
import { MonthlyEarningsChartComponent } from '../components/monthly-earnings-chart/monthly-earnings-chart.component';
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
  imports: [
    QuarterlyAnalysisComponent,
    BrnSelectImports,
    HlmSelectImports,
    NetEarningsChartComponent,
    ClientEarningsComponent,
    MonthlyEarningsChartComponent,
  ],
  template: `
    <section class="grid grid-cols-1 gap-4 mx-4 mb-4">
      <article class="space-y-4">
        <div>
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
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <app-quarterly-analysis
            [financialDataInput]="ivaAmount()"
            title="IVA"
            description="Quarterly tax breakdown"
            [selectedYear]="selectedYear()"
            textColor="text-rose-600"
          ></app-quarterly-analysis>
          <app-quarterly-analysis
            [financialDataInput]="irpfAmount()"
            title="IRPF"
            description="Quarterly tax breakdown"
            [selectedYear]="selectedYear()"
            textColor="text-amber-600"
          ></app-quarterly-analysis>
          <app-quarterly-analysis
            [financialDataInput]="earningsBeforeTaxes()"
            title="Gross Earnings"
            description="Quarterly earnings breakdown before taxes"
            [selectedYear]="selectedYear()"
            textColor="text-teal-600"
          ></app-quarterly-analysis>
          <app-quarterly-analysis
            [financialDataInput]="earningsAfterTaxes()"
            title="Net Earnings"
            description="Quarterly earnings breakdown after IVA"
            [selectedYear]="selectedYear()"
            textColor="text-emerald-600"
          ></app-quarterly-analysis>
        </div>
      </article>
      <article class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <app-net-earnings-chart
          [years]="years()"
          [earnings]="earningsPerYear()"
          color="rgba(0, 128, 128, 0.7)"
        />
        <app-client-earnings
          [clientEarnings]="clientEarnings()"
        ></app-client-earnings>
        <app-monthly-earnings-chart
          [monthlyEarnings]="monthlyEarnings()"
          [selectedYear]="selectedYear()"
        ></app-monthly-earnings-chart>
      </article>
    </section>
  `,
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  invoicesService = inject(InvoicesServiceService);
  clientsService = inject(ClientService);
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

  protected readonly earningsPerYear = computed(() => {
    const earnings: number[] = [];
    this.invoices().forEach((invoice) => {
      const year = new Date(invoice.issueDate).getFullYear();
      earnings[year] =
        (earnings[year] || 0) + invoice.total - invoice.ivaAmount;
    });
    return earnings.filter((amount) => amount !== undefined);
  });

  protected readonly clientEarnings = computed(() => {
    const yearInvoices = this.invoices().filter(
      (invoice) =>
        new Date(invoice.issueDate).getFullYear() ===
        Number(this.selectedYear())
    );

    const activeClientIds = [
      ...new Set(yearInvoices.map((invoice) => invoice.clientId)),
    ];

    return this.clients()
      .filter((client) => activeClientIds.includes(client.id))
      .map((client) => ({
        client: client.name,
        earnings: yearInvoices
          .filter((invoice) => invoice.clientId === client.id)
          .reduce((acc, invoice) => acc + invoice.total, 0),
      }));
  });

  protected readonly monthlyEarnings = computed(() => {
    const yearInvoices = this.invoices().filter(
      (invoice) =>
        new Date(invoice.issueDate).getFullYear() ===
        Number(this.selectedYear())
    );
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    return months.map((month) => {
      return yearInvoices
        .filter(
          (invoice) => new Date(invoice.issueDate).getMonth() + 1 === month
        )
        .reduce((acc, invoice) => acc + invoice.total - invoice.ivaAmount, 0);
    });
  });

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
