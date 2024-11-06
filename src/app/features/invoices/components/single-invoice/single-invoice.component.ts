import { Component, signal, inject, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InvoicesServiceService } from '../../services/invoices-service.service';
import { UserService } from '../../../user/services/user.service';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { Invoice } from '../../interface';
import { UserInfo } from '../../../user/interface';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { lucideSave } from '@ng-icons/lucide';

@Component({
  selector: 'app-single-invoice',
  standalone: true,
  imports: [DatePipe, HlmSpinnerComponent, CommonModule, HlmButtonDirective, HlmIconComponent],
  providers: [provideIcons({ lucideSave })],
  template: `
    @defer (when invoice()) {
      <div class="flex justify-center m-4 print:hidden">
        <button
          hlmBtn
          (click)="printInvoice()"
          class="flex items-center gap-2"
        >
          <hlm-icon name="lucideSave" size="sm" />
          Save as PDF
        </button>
      </div>
      <div #invoiceContainer class="max-w-4xl mx-auto bg-white p-8 shadow-lg print:shadow-none">
        <!-- Header -->
        <div class="flex justify-between mb-8">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">INVOICE</h1>
            <p class="text-gray-600">#{{ invoice()?.invoiceNumber }}</p>
          </div>
          <div class="text-right">
            <p class="font-bold text-gray-900">Issue Date: {{ invoice()?.issueDate | date:'dd/MM/yyyy' }}</p>
            <p class="text-gray-600">Due Date: {{ invoice()?.dueDate | date:'dd/MM/yyyy' }}</p>
          </div>
        </div>

        <!-- Client Info -->
        <div class="mb-8">
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Bill To:</h2>
          <p class="text-gray-700">{{ invoice()?.clientName }}</p>
        </div>

        <!-- User Info -->
        <div class="mb-8">
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Issued By:</h2>
          <p class="text-gray-700">{{ user()?.name }}</p>
        </div>

        <!-- Subject -->
        @if (invoice()?.subject) {
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-900 mb-2">Subject:</h2>
            <p class="text-gray-700">{{ invoice()?.subject }}</p>
          </div>
        }

        <!-- Items Table -->
        <table class="w-full mb-8">
          <thead>
            <tr class="border-b-2 border-gray-300">
              <th class="text-left py-2 text-gray-900">Description</th>
              <th class="text-right py-2 text-gray-900">Quantity</th>
              <th class="text-right py-2 text-gray-900">Price</th>
              <th class="text-right py-2 text-gray-900">Amount</th>
            </tr>
          </thead>
          <tbody>
            @for (item of invoice()?.items; track $index) {
              <tr class="border-b border-gray-200">
                <td class="py-2 text-gray-700">{{ item.description }}</td>
                <td class="text-right py-2 text-gray-700">{{ item.quantity }}</td>
                <td class="text-right py-2 text-gray-700">{{ item.price }} {{ invoice()?.currency }}</td>
                <td class="text-right py-2 text-gray-700">{{ item.amount }} {{ invoice()?.currency }}</td>
              </tr>
            }
          </tbody>
        </table>

        <!-- Totals -->
        <div class="w-1/2 ml-auto">
          <div class="flex justify-between py-2">
            <span class="text-gray-700">Subtotal:</span>
            <span class="text-gray-700">{{ invoice()?.subtotal }} {{ invoice()?.currency }}</span>
          </div>
          
          <div class="flex justify-between py-2">
            <span class="text-gray-700">IVA ({{ invoice()?.ivaRate }}%):</span>
            <span class="text-gray-700">{{ invoice()?.ivaAmount }} {{ invoice()?.currency }}</span>
          </div>
          
          <div class="flex justify-between py-2">
            <span class="text-gray-700">IRPF ({{ invoice()?.irpfRate }}%):</span>
            <span class="text-gray-700">-{{ invoice()?.irpfAmount }} {{ invoice()?.currency }}</span>
          </div>
          
          <div class="flex justify-between py-2 font-bold border-t-2 border-gray-300">
            <span class="text-gray-900">Total:</span>
            <span class="text-gray-900">{{ invoice()?.total }} {{ invoice()?.currency }}</span>
          </div>
        </div>

        <!-- Notes -->
        @if (invoice()?.notes) {
          <div class="mt-8 pt-4 border-t border-gray-300">
            <h2 class="text-lg font-semibold text-gray-900 mb-2">Notes:</h2>
            <p class="text-gray-600">{{ invoice()?.notes }}</p>
          </div>
        }
      </div>
    } @placeholder (minimum 200ms){
      <div class="flex justify-center items-center p-8">
        <hlm-spinner class="h-10 w-10" />
      </div>
    }
  `
})
export class SingleInvoiceComponent {
  private invoicesService = inject(InvoicesServiceService);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);

  invoice = signal<Invoice | null>(null);
  user = signal<UserInfo | null>(null);

  @ViewChild('invoiceContainer') invoiceContainer!: ElementRef;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.invoicesService.getInvoiceById(id).subscribe({
        next: (invoice) => {
          this.invoice.set(invoice);
          console.log(invoice);
        },
        error: (error) => console.error('Error fetching invoice:', error),
      });
    });
    this.userService.getUser().subscribe(user => this.user.set(user));
  }

  printInvoice() {
    const printContents = this.invoiceContainer.nativeElement;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <link rel="stylesheet" href="${window.location.origin}/styles.css">
          <style>
            body { margin: 0; padding: 16px; }
            @media print {
              @page { margin: 0; }
              body { margin: 16px; }
            }
          </style>
        </head>
        <body>
          ${printContents.outerHTML}
        </body>
      </html>
    `);

    // Wait for styles to load
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    };
  }
}