import { Component, computed, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidatorFn, FormArray } from '@angular/forms';
import { InvoicesServiceService } from '../../services/invoices-service.service';
import { ClientService } from '../../../clients/services/clients.service';
import { Client } from '../../../clients/interface';

import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';


@Component({
  selector: 'app-new-invoice',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HlmButtonDirective,
    HlmLabelDirective,
    HlmInputDirective,
  ],
  host: {
    class: 'block w-full max-w-xl mx-auto'
  },
  template: `
  <form [formGroup]="invoiceForm" (ngSubmit)="onSubmit()">
    <div class="grid gap-4">
      <div class="flex flex-col gap-2">
        <div class="grid grid-cols-3 gap-4">
          <div class="flex flex-col gap-2">
            <label hlmLabel for="invoiceNumber">Invoice Number</label>
            <input hlmInput id="invoiceNumber" formControlName="invoiceNumber" />
          </div>
          <div class="flex flex-col gap-2">
            <label hlmLabel for="clientSelect">Select Client</label>
            <select hlmInput id="clientSelect" formControlName="clientId" (change)="onClientSelect($event)">
              <option value="">Select a client</option>
              @for (client of clients(); track client.id) {
                <option [value]="client.id">{{ client.name }}</option>
              }
            </select>
          </div>
          <div class="flex flex-col gap-2">
            <label hlmLabel for="clientName">Client Name</label>
            <input hlmInput id="clientName" formControlName="clientName" readonly />
          </div>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div class="flex flex-col gap-2">
            <label hlmLabel for="issueDate">Issue Date</label>
            <input hlmInput id="issueDate" formControlName="issueDate" type="date" />
          </div>
          <div class="flex flex-col gap-2">
            <label hlmLabel for="dueDate">Due Date</label>
            <input hlmInput id="dueDate" formControlName="dueDate" type="date" />
          </div>
          <div class="flex flex-col gap-2">
            <label hlmLabel for="currency">Currency</label>
            <select hlmInput id="currency" formControlName="currency">
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>
        <label hlmLabel for="subject">Subject</label>
        <input hlmInput id="subject" formControlName="subject" type="text" />
        <label hlmLabel for="notes">Notes</label>
        <input hlmInput id="notes" formControlName="notes" type="text" />

        <div class="grid grid-cols-4 gap-4">
          <div class="flex flex-col gap-2">
            <label hlmLabel for="ivaRate">IVA Rate</label>
            <input hlmInput id="ivaRate" formControlName="ivaRate" type="number" />
          </div>
          <div class="flex flex-col gap-2">
            <label hlmLabel for="ivaAmount">IVA Amount</label>
            <input hlmInput id="ivaAmount" formControlName="ivaAmount" type="number" readonly/>
          </div>
          <div class="flex flex-col gap-2">
            <label hlmLabel for="irpfRate">IRPF Rate</label>
            <input hlmInput id="irpfRate" formControlName="irpfRate" type="number" />
          </div>
          <div class="flex flex-col gap-2">
            <label hlmLabel for="irpfAmount">IRPF Amount</label>
            <input hlmInput id="irpfAmount" formControlName="irpfAmount" type="number" readonly/>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label hlmLabel for="subtotal">Subtotal</label>
            <input hlmInput id="subtotal" formControlName="subtotal" type="number" readonly/>
          </div>
          <div class="flex flex-col gap-2">
            <label hlmLabel for="total">Total</label>
            <input hlmInput id="total" formControlName="total" type="number" readonly/>
          </div>
      </div>

      <button hlmBtn type="submit" [disabled]="invoiceForm.invalid">Create Invoice</button>
    </div>
  </form>
  `
})
export class NewInvoiceComponent {
  clients = signal<Partial<Client>[]>([]);
  invoiceForm: FormGroup;

  constructor(private invoiceService: InvoicesServiceService, private clientService: ClientService, private fb: FormBuilder) {
    this.invoiceForm = this.fb.group({
      invoiceNumber: ['', Validators.required],
      clientId: ['', Validators.required],
      clientName: ['', Validators.required],
      issueDate: [new Date().toISOString().slice(0, 10), Validators.required],
      dueDate: [new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().slice(0, 10), Validators.required],
      currency: ['EUR', Validators.required],
      subject: ['', Validators.required],
      ivaRate: [10, Validators.required],
      ivaAmount: [0, Validators.required],
      irpfRate: [15, Validators.required],
      irpfAmount: [0, Validators.required],
      notes: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.clientService.getClients().subscribe(clients => {
      const simplifiedClients = clients.map(client => ({
        id: client.id,
        name: client.name
      }));
      this.clients.set(simplifiedClients);
    });
  }

  onClientSelect(event: Event) {
    const selectedClientId = (event.target as HTMLSelectElement).value;
    const selectedClient = this.clients().find(client => client.id === selectedClientId);
    this.invoiceForm.patchValue({ clientName: selectedClient?.name || '' });
  }

  onSubmit() {
    if (this.invoiceForm.valid) {
      console.log(this.invoiceForm.value);
      // this.invoiceService.createInvoice(this.invoiceForm.value).subscribe();
    }
  }
}
