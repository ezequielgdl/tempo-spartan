import { Component, signal } from '@angular/core';
import { InvoicesServiceService } from '../../invoices/services/invoices-service.service';
import { Invoice } from '../../invoices/interface'
@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [],
  template: `
    <p>
      analytics works!
    </p>
  `,
  styles: ``
})
export class AnalyticsComponent {
  invoices = signal<Invoice[]>([]);

  constructor(private invoicesService: InvoicesServiceService) {
    this.invoicesService.invoices$.subscribe(invoices => {
      this.invoices.set(invoices!);
      console.log(this.invoices());
    });
  }

}
