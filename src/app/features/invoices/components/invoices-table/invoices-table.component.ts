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
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
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
    DatePipe
  ],
  host: {
    class: 'w-full'
  },
  template: `
    <div class="flex mb-4">  
      <select hlmInput id="clientSelect" (change)="onClientSelect($event)">
        <option value="">All Clients</option>
        @for (client of clients(); track client.id) {
        <option [value]="client.id">{{ client.name }}</option>
      }
      </select>
    </div>
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

  onClientSelect(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedClientId.set(selectedValue ? selectedValue : null);
  }
}
