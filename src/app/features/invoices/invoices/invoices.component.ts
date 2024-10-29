import { Component, signal } from '@angular/core';
import { InvoicesServiceService } from '../services/invoices-service.service';
import { InvoicesTableComponent } from '../components/invoices-table/invoices-table.component';
import { ClientService } from '../../clients/services/clients.service';
import { Invoice } from '../interface';
import { Client } from '../../clients/interface';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [InvoicesTableComponent],
  host: {
    class: 'block max-w-5xl mx-auto w-full p-4 flex flex-col gap-6'
  },
  template: `
    <app-invoices-table [invoices]="invoices"/>
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
