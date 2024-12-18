import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Input,
  signal,
} from '@angular/core';
import { Invoice } from '../../interface';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
  HlmCaptionComponent,
  HlmTableComponent,
  HlmTdComponent,
  HlmThComponent,
  HlmTrowComponent,
} from '@spartan-ng/ui-table-helm';
import { HlmSwitchComponent } from '@spartan-ng/ui-switch-helm';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { DeleteInvoiceComponent } from '../delete-invoice/delete-invoice.component';
import { Client } from '../../../clients/interface';
import { ClientService } from '../../../clients/services/clients.service';
import { InvoicesServiceService } from '../../services/invoices-service.service';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-invoices-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HlmCaptionComponent,
    HlmTableComponent,
    HlmTdComponent,
    HlmThComponent,
    HlmTrowComponent,
    HlmIconComponent,
    DeleteInvoiceComponent,
    DatePipe,
    BrnSelectImports,
    HlmSelectImports,
    RouterLink,
    HlmButtonDirective,
    HlmSwitchComponent,
  ],
  host: {
    class: 'w-full',
  },
  template: `
    <div class="flex justify-start gap-2">
      <brn-select class="inline-block" placeholder="All Clients">
        <hlm-select-trigger>
          <hlm-select-value />
        </hlm-select-trigger>
        <hlm-select-content class="min-w-48">
          <hlm-option value="" (click)="onClientSelect(undefined)"
            >All Clients</hlm-option
          >
          @for (client of clients(); track client.id) {
          <hlm-option [value]="client.id" (click)="onClientSelect(client.id)">{{
            client.name
          }}</hlm-option>
          }
        </hlm-select-content>
      </brn-select>
      <brn-select
        class="inline-block mb-4"
        [placeholder]="selectedYear()?.toString() ?? 'Filter by year'"
      >
        <hlm-select-trigger>
          <hlm-select-value />
        </hlm-select-trigger>
        <hlm-select-content class="w-56">
          @for (year of years(); track year) {
          <hlm-option
            [value]="year.toString()"
            (click)="onYearSelect(year.toString())"
            >{{ year }}</hlm-option
          >
          }
        </hlm-select-content>
      </brn-select>
    </div>
    <div class="overflow-x-auto">
      <hlm-table class="min-w-[800px] w-full">
        <hlm-trow>
          <hlm-th
            class="flex-1 cursor-pointer text-left"
            (click)="toggleSortDirection()"
          >
            Date
            <span class="ml-1">{{
              sortDirection() === 'asc' ? '▲' : '▼'
            }}</span>
          </hlm-th>
          <hlm-th class="flex-1 text-left">Invoice</hlm-th>
          <hlm-th class="flex-1 text-left">Total</hlm-th>
          <hlm-th class="flex-1 text-left">Client</hlm-th>
          <hlm-th class="flex-1 text-left">Paid</hlm-th>
          <hlm-th class="flex-1 text-right">Actions</hlm-th>
        </hlm-trow>
        @if (sortedInvoices().length === 0) {
        <div class="text-center text-sm text-gray-500 my-4">
          No invoices found.
        </div>
        } @else { @for (invoice of sortedInvoices(); track invoice.id) {
        <hlm-trow>
          <hlm-td class="flex-1">{{
            invoice.issueDate | date : 'dd/MM/yyyy'
          }}</hlm-td>
          <hlm-td class="flex-1">{{ invoice.invoiceNumber }}</hlm-td>
          <hlm-td class="flex-1 justify-center">{{ invoice.total }}</hlm-td>
          <hlm-td class="flex-1">{{ invoice.clientName }}</hlm-td>
          <hlm-td class="flex-1 justify-center" (click)="onTogglePaid(invoice)">
            <hlm-switch [checked]="invoice.isPaid" />
            <span class="ml-2">{{ invoice.isPaid ? 'Yes' : 'No' }}</span>
          </hlm-td>
          <hlm-td class="flex-1 flex justify-end space-x-2">
            <button hlmBtn routerLink="/invoices/{{ invoice.id }}">View</button>
            <button hlmBtn routerLink="/invoices/edit/{{ invoice.id }}">
              Edit
            </button>
            <app-delete-invoice [invoiceId]="invoice.id" />
          </hlm-td>
        </hlm-trow>
        } }
      </hlm-table>
    </div>
  `,
})
export class InvoicesTableComponent {
  private readonly invoicesService = inject(InvoicesServiceService);
  private readonly clientsService = inject(ClientService);
  private readonly destroy$ = new Subject<void>();
  @Input() invoices = signal<Invoice[]>([]);
  clients = signal<Partial<Client>[]>([]);
  selectedClientId = signal<string | null>(null);
  selectedYear = signal<string | null>(new Date().getFullYear().toString());

  filteredInvoices = computed(() => {
    return this.invoices().filter((invoice) => {
      const clientMatch =
        !this.selectedClientId() ||
        invoice.clientId === this.selectedClientId();
      const yearMatch =
        !this.selectedYear() ||
        new Date(invoice.issueDate).getFullYear().toString() ===
          this.selectedYear();
      return clientMatch && yearMatch;
    });
  });

  sortDirection = signal<'asc' | 'desc'>('desc');

  sortedInvoices = computed(() => {
    return this.filteredInvoices().sort((a, b) => {
      const comparison =
        new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
      return this.sortDirection() === 'asc' ? -comparison : comparison;
    });
  });

  years = computed(() => {
    const years = this.invoices().map((invoice) =>
      new Date(invoice.issueDate).getFullYear().toString()
    );
    return [...new Set(years)].sort();
  });

  ngOnInit(): void {
    this.clientsService
      .getClients()
      .pipe(takeUntil(this.destroy$))
      .subscribe((clients) => {
        this.clients.set(clients!);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClientSelect(clientId: string | undefined): void {
    this.selectedClientId.set(clientId ?? null);
  }

  onYearSelect(year: string | undefined): void {
    this.selectedYear.set(year ?? null);
  }

  toggleSortDirection(): void {
    this.sortDirection.update((current) =>
      current === 'asc' ? 'desc' : 'asc'
    );
  }

  onTogglePaid(invoice: Invoice): void {
    this.invoicesService.toggleInvoicePaid(invoice).subscribe();
  }
}
