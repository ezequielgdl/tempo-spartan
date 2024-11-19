import { Component, signal, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InvoicesServiceService } from '../../services/invoices-service.service';
import { ClientService } from '../../../clients/services/clients.service';
import { UserService } from '../../../user/services/user.service';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { Invoice } from '../../interface';
import { Client } from '../../../clients/interface';
import { UserInfo } from '../../../user/interface';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { lucideSave } from '@ng-icons/lucide';
import { NgxPrintModule } from 'ngx-print';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-single-invoice',
  standalone: true,
  imports: [
    DatePipe,
    HlmSpinnerComponent,
    CommonModule,
    HlmButtonDirective,
    HlmIconComponent,
    NgxPrintModule,
  ],
  providers: [provideIcons({ lucideSave })],
  template: `
    @defer (when invoice()) {
    <div class="flex justify-center m-4 print:hidden">
      <button
        hlmBtn
        [printStyle]="{
          '@page': {
            size: 'A4',
            margin: '15mm'
          }
        }"
        [useExistingCss]="true"
        [printTitle]="'Invoice ' + (invoice()?.invoiceNumber || '')"
        [printSectionId]="printId"
        ngxPrint
        class="flex items-center gap-2"
      >
        <hlm-icon name="lucideSave" size="sm" />
        Save as PDF
      </button>
    </div>
    <div
      #invoiceContainer
      [id]="printId"
      class="max-w-4xl mx-auto bg-white p-8 shadow-lg print:shadow-none"
    >
      <!-- Header -->
      <div class="flex justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">INVOICE</h1>
          <p class="text-gray-600">#{{ invoice()?.invoiceNumber }}</p>
        </div>
        <div class="text-right">
          <p class="font-bold text-gray-900">
            Issue Date: {{ invoice()?.issueDate | date : 'dd/MM/yyyy' }}
          </p>
          <p class="text-gray-600">
            Due Date: {{ invoice()?.dueDate | date : 'dd/MM/yyyy' }}
          </p>
        </div>
      </div>

      <!-- Client and User Info -->
      <div class="mb-8 flex justify-between">
        <div class="w-1/2 pr-4">
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Bill To:</h2>
          <p class="text-gray-700">{{ client()?.name }}</p>
          <p class="text-gray-700">{{ client()?.CIF }}</p>
          <p class="text-gray-700">{{ client()?.address }}</p>
          <p class="text-gray-700">{{ client()?.email }}</p>
          <p class="text-gray-700">{{ client()?.phone }}</p>
        </div>
        <div class="w-1/2 pl-4">
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Issued By:</h2>
          <p class="text-gray-700">{{ user()?.name }}</p>
          <p class="text-gray-700">{{ user()?.nif }}</p>
          <p class="text-gray-700">{{ user()?.address }}</p>
          <p class="text-gray-700">{{ user()?.phone }}</p>
          <p class="text-gray-700">{{ user()?.website }}</p>
        </div>
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
            <td class="text-right py-2 text-gray-700">
              {{ item.price }} {{ invoice()?.currency }}
            </td>
            <td class="text-right py-2 text-gray-700">
              {{ item.amount }} {{ invoice()?.currency }}
            </td>
          </tr>
          }
        </tbody>
      </table>

      <!-- Totals -->
      <div class="w-1/2 ml-auto">
        <div class="flex justify-between py-2">
          <span class="text-gray-700">Subtotal:</span>
          <span class="text-gray-700"
            >{{ invoice()?.subtotal }} {{ invoice()?.currency }}</span
          >
        </div>

        <div class="flex justify-between py-2">
          <span class="text-gray-700">IVA ({{ invoice()?.ivaRate }}%):</span>
          <span class="text-gray-700"
            >{{ invoice()?.ivaAmount }} {{ invoice()?.currency }}</span
          >
        </div>

        <div class="flex justify-between py-2">
          <span class="text-gray-700">IRPF ({{ invoice()?.irpfRate }}%):</span>
          <span class="text-gray-700"
            >-{{ invoice()?.irpfAmount }} {{ invoice()?.currency }}</span
          >
        </div>

        <div
          class="flex justify-between py-2 font-bold border-t-2 border-gray-300"
        >
          <span class="text-gray-900">Total:</span>
          <span class="text-gray-900"
            >{{ invoice()?.total }} {{ invoice()?.currency }}</span
          >
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
    } @placeholder {
    <div class="flex justify-center items-center p-8">
      <hlm-spinner class="h-10 w-10" />
    </div>
    }
  `,
})
export class SingleInvoiceComponent {
  private invoicesService = inject(InvoicesServiceService);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private clientService = inject(ClientService);
  private readonly destroy$ = new Subject<void>();

  invoice = signal<Invoice | null>(null);
  user = signal<UserInfo | null>(null);
  client = signal<Client | null>(null);

  printId = 'invoicePrint';

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = params['id'];
      this.invoicesService.getInvoiceById(id).subscribe({
        next: (invoice) => {
          this.invoice.set(invoice);
          this.clientService
            .getClientById(invoice?.clientId ?? '')
            .subscribe((client) => this.client.set(client));
        },
        error: (error) => console.error('Error fetching invoice:', error),
      });
    });
    this.userService
      .getUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => this.user.set(user));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
