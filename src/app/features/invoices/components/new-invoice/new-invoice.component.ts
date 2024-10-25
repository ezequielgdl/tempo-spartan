import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidatorFn } from '@angular/forms';
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
  template: `
  <form [formGroup]="invoiceForm" (ngSubmit)="onSubmit()">
    <div class="grid gap-4">
      <div class="flex flex-col gap-2">
        <label hlmLabel for="invoiceNumber">Invoice Number</label>
        <input hlmInput id="invoiceNumber" formControlName="invoiceNumber" />
        <label hlmLabel for="clientSelect">Select Client</label>
        <select hlmInput id="clientSelect" formControlName="clientId" (change)="onClientSelect($event)">
          <option value="">Select a client</option>
          @for (client of clients(); track client.id) {
            <option [value]="client.id">{{ client.name }}</option>
          }
        </select>
        <label hlmLabel for="clientName">Client Name</label>
        <input hlmInput id="clientName" formControlName="clientName" readonly />
        <label hlmLabel for="issueDate">Issue Date</label>
        <input hlmInput id="issueDate" formControlName="issueDate" type="date" />
        <label hlmLabel for="dueDate">Due Date</label>
        <input hlmInput id="dueDate" formControlName="dueDate" type="date" />
      </div>
      
      <!-- Add more form fields here as needed -->
      
      <button hlmBtn type="submit" [disabled]="invoiceForm.invalid">Create Invoice</button>
    </div>
  </form>


  `,
  styles: ``
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
      ivaRate: [0, Validators.required],
      irpfRate: [0, Validators.required],
      notes: ['', Validators.required],
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
      this.invoiceService.createInvoice(this.invoiceForm.value).subscribe();
    }
  }

  onSave(event: any) {
    this.invoiceService.createInvoice(event).subscribe();
  }
}
