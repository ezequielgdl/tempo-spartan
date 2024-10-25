import { Component, computed, Input, signal } from '@angular/core';
import { Invoice } from '../../interface';
import { DatePipe } from '@angular/common';
import {
  HlmCaptionComponent,
  HlmTableComponent,
  HlmTdComponent,
  HlmThComponent,
  HlmTrowComponent,
} from '@spartan-ng/ui-table-helm';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { DeleteInvoiceComponent } from '../delete-invoice/delete-invoice.component';
import { EditInvoiceComponent } from '../edit-invoice/edit-invoice.component';
import { Client } from '../../../clients/interface';
import { ClientService } from '../../../clients/services/clients.service';
@Component({
  selector: 'app-invoices-table',
  standalone: true,
  imports: [
    HlmCaptionComponent,
    HlmTableComponent,
    HlmTdComponent,
    HlmThComponent,
    HlmTrowComponent,
    HlmIconComponent,
    DeleteInvoiceComponent,
    EditInvoiceComponent,
    DatePipe,
    BrnSelectImports,
    HlmSelectImports
  ],
  host: {
    class: 'w-full'
  },
  template: `
    <brn-select class="inline-block mb-4" placeholder="Filter by client">
      <hlm-select-trigger>
        <hlm-select-value />
      </hlm-select-trigger>
      <hlm-select-content class="w-56">
        <hlm-option value="">All Clients</hlm-option>
        @for (client of clients(); track client.id) {
          <hlm-option [value]="client.id" (click)="onClientSelect(client.id)">{{ client.name }}</hlm-option>
        }
      </hlm-select-content>
    </brn-select>
    <hlm-table class="w-full">
      <hlm-caption>A list of your invoices.</hlm-caption>
      <hlm-trow>
        <hlm-th class="flex-1">Date</hlm-th>
        <hlm-th class="flex-1">Invoice</hlm-th>
        <hlm-th class="flex-1">Total</hlm-th>
        <hlm-th class="flex-1">Client</hlm-th>
        <hlm-th class="flex-1 flex justify-end">Actions</hlm-th>
      </hlm-trow>
      @for (invoice of filteredInvoices(); track invoice.id) {
        <hlm-trow>
          <hlm-td class="flex-1">{{ invoice.issueDate | date:'dd/MM/yyyy' }}</hlm-td>
          <hlm-td class="flex-1">{{ invoice.invoiceNumber }}</hlm-td>
          <hlm-td class="flex-1">{{ invoice.total }}</hlm-td>
          <hlm-td class="flex-1">{{ invoice.clientName }}</hlm-td>
          <hlm-td class="flex-1 flex justify-end space-x-2">
            <app-edit-invoice [invoice]="invoice" />
            <app-delete-invoice [invoiceId]="invoice.id" />
          </hlm-td>
        </hlm-trow>
      }
    </hlm-table>
  `,
  styles: ``
})
export class InvoicesTableComponent {
  @Input() invoices = signal<Invoice[]>([]);
  clients = signal<Partial<Client>[]>([]);
  selectedClientId = signal<string | null>(null);
  selectedYear = signal<string | null>('2024');

  constructor(private clientsService: ClientService) {}

  filteredInvoices = computed(() => 
    this.selectedClientId()
      ? this.invoices().filter(invoice => invoice.clientId === this.selectedClientId())
      : this.invoices()
  );

  ngOnInit(): void {
    this.clientsService.getClients().subscribe(clients => {
      this.clients.set(clients!);
    });
  }

  onClientSelect(clientId: string | undefined): void {
    this.selectedClientId.set(clientId ?? null);
  }
}
