import { Component, Input } from '@angular/core';
import { Invoice } from '../../interface';
import {
  HlmCaptionComponent,
  HlmTableComponent,
  HlmTdComponent,
  HlmThComponent,
  HlmTrowComponent,
} from '@spartan-ng/ui-table-helm';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { DeleteInvoiceComponent } from '../delete-invoice/delete-invoice.component';

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
    DeleteInvoiceComponent
  ],
  host: {
    class: 'w-full'
  },
  template: `
    <hlm-table class="w-full">
      <hlm-caption>A list of your invoices.</hlm-caption>
      <hlm-trow>
        <hlm-th class="">Date</hlm-th>
        <hlm-th class="">Invoice</hlm-th>
        <hlm-th class="flex">Actions</hlm-th>
      </hlm-trow>
      @for (invoice of invoices; track invoice.id) {
        <hlm-trow>
          <hlm-td class="">{{ invoice.date }}</hlm-td>
          <hlm-td class="">{{ invoice.invoiceNumber }}</hlm-td>
          <hlm-td class="flex">
            <!-- <app-edit-invoice [invoice]="invoice" /> -->
            <app-delete-invoice [invoiceId]="invoice.id" />
          </hlm-td>
        </hlm-trow>
      }
    </hlm-table>
  `,
  styles: ``
})
export class InvoicesTableComponent {
  @Input() invoices: Invoice[] = [];

}
