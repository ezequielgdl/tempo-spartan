import { Component, signal } from '@angular/core';
import { InvoicesServiceService } from '../services/invoices-service.service';
import { InvoicesTableComponent } from '../components/invoices-table/invoices-table.component';
import { ClientService } from '../../clients/services/clients.service';
import { Invoice } from '../interface';
import { Client } from '../../clients/interface';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [InvoicesTableComponent, HlmSpinnerComponent],
  host: {
    class: 'block max-w-5xl mx-auto w-full p-4 flex flex-col gap-6'
  },
  template: `
    @defer {
      <app-invoices-table [invoices]="invoices" />
    } @loading (minimum 300ms) {
      <div class="flex justify-center items-center h-full">
        <hlm-spinner />
      </div>
    }
  `,
})
export class InvoicesComponent {
  invoices = signal<Invoice[]>([]);

  constructor(private invoicesService: InvoicesServiceService) {
    this.invoicesService.invoices$.subscribe(invoices => {
      if (invoices) {
        this.invoices.set(invoices);
      }
    });
  }
}
