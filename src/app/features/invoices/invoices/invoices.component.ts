import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { InvoicesServiceService } from '../services/invoices-service.service';
import { InvoicesTableComponent } from '../components/invoices-table/invoices-table.component';
import { Invoice } from '../interface';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-invoices',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InvoicesTableComponent, HlmSpinnerComponent, HlmButtonDirective],
  host: {
    class: 'block max-w-5xl mx-auto w-full p-4 flex flex-col gap-6',
  },
  template: `
    <button class="w-fit" hlmBtn (click)="createInvoice()">
      Create Invoice
    </button>
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
  private readonly destroy$ = new Subject<void>();

  constructor(
    private invoicesService: InvoicesServiceService,
    private router: Router
  ) {
    this.invoicesService.invoices$
      .pipe(takeUntil(this.destroy$))
      .subscribe((invoices) => {
        if (invoices) {
          this.invoices.set(invoices);
        }
      });
  }

  createInvoice() {
    this.router.navigate(['/invoices/new']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
