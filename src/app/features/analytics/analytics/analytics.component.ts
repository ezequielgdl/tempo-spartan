import { ChangeDetectionStrategy, Component, OnInit, computed, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { ClientService } from '../../clients/services/clients.service';
import { InvoicesServiceService } from '../../invoices/services/invoices-service.service';
import { Client } from '../../clients/interface';
import { Invoice } from '../../invoices/interface';
import { IvaAnalysisComponent } from '../components/iva-analysis/iva-analysis.component';

@Component({
  selector: 'app-analytics',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    JsonPipe,
    IvaAnalysisComponent
  ],
  template: `
    <app-iva-analysis [ivaAmount]="ivaAmount()"></app-iva-analysis>
  `,
  styles: ``
})
export class AnalyticsComponent implements OnInit {
  // Signals
  protected readonly invoices = signal<Invoice[]>([]);
  protected readonly clients = signal<Client[]>([]);
  
  // Computed values
  protected readonly ivaAmount = computed(() => 
    this.invoices().map(invoice => ({
      ivaAmount: invoice.ivaAmount, 
      issueDate: invoice.issueDate
    }))
  );

  constructor(
    private readonly invoicesService: InvoicesServiceService,
    private readonly clientsService: ClientService
  ) {}

  ngOnInit(): void {
    this.invoicesService.invoices$.subscribe(invoices => {
      if (invoices && invoices.length > 0) {
        this.invoices.set(invoices);
      }
    });

    this.clientsService.getClients().subscribe(clients => {
      if (clients && clients.length > 0) {
        this.clients.set(clients);
      }
    });
  }
}
