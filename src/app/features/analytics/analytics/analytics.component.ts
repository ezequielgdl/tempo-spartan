import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, computed, signal } from '@angular/core';
import { ClientService } from '../../clients/services/clients.service';
import { InvoicesServiceService } from '../../invoices/services/invoices-service.service';
import { Client } from '../../clients/interface';
import { Invoice } from '../../invoices/interface';
import { IvaAnalysisComponent } from '../components/iva-analysis/iva-analysis.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-analytics',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IvaAnalysisComponent
  ],
  template: `
    <app-iva-analysis [ivaAmount]="ivaAmount()"></app-iva-analysis>
  `,
  styles: ``
})
export class AnalyticsComponent implements OnInit, OnDestroy {
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

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly invoicesService: InvoicesServiceService,
    private readonly clientsService: ClientService
  ) {}

  ngOnInit(): void {
    this.invoicesService.invoices$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(invoices => {
      if (invoices && invoices.length > 0) {
        this.invoices.set(invoices);
      }
    });

    this.clientsService.getClients().pipe(
      takeUntil(this.destroy$)
    ).subscribe(clients => {
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
