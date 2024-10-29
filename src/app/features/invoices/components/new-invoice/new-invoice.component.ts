import { Component, computed, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidatorFn, FormArray } from '@angular/forms';
import { InvoicesServiceService } from '../../services/invoices-service.service';
import { ClientService } from '../../../clients/services/clients.service';
import { Client } from '../../../clients/interface';

import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { CurrencyPipe } from '@angular/common';
import { Item } from '../../interface'
import { Router } from '@angular/router';

import { merge, EMPTY } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-new-invoice',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HlmButtonDirective,
    HlmLabelDirective,
    HlmInputDirective,
    CurrencyPipe
  ],
  host: {
    class: 'block w-full max-w-3xl mx-auto'
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

      <div class="flex flex-col gap-2 my-4">
        <span hlmLabel>Items</span>
        <button hlmBtn class="w-fit my-2" type="button" (click)="addItem()">Add Item</button>
        <hr class="my-4"/>
        <div formArrayName="items" class="flex flex-col gap-2">
          @for (item of items.controls; track $index) {
            <div [formGroupName]="$index" class="flex flex-col gap-4">
              <div class="flex gap-2">
                <div class="flex-1 flex flex-col gap-2">
                  <label hlmLabel for="description">Description</label>
                  <input hlmInput id="description" formControlName="description" placeholder="Description"/>
                </div>
                <button hlmBtn type="button" class="mt-6 px-2 py-1" (click)="removeItem($index)">✕</button>
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div class="flex flex-col gap-2">
                  <label hlmLabel for="quantity">Quantity</label>
                  <input hlmInput id="quantity" type="number" formControlName="quantity" placeholder="Qty"/>
                </div>
                <div class="flex flex-col gap-2">
                  <label hlmLabel for="price">Price</label>
                  <input hlmInput id="price" type="number" formControlName="price" placeholder="Price"/>
                </div>
                <div class="flex flex-col gap-2">
                  <label hlmLabel for="amount">Amount</label>
                  <input hlmInput id="amount" type="number" formControlName="amount" readonly/>
                </div>
              </div>
            </div>
            <hr class="my-4"/>
          }
        </div>
      </div>

      <div class="grid grid-cols-4 gap-4">
          <div class="flex flex-col gap-2">
            <label hlmLabel for="ivaRate">IVA Rate (%) </label>
            <input hlmInput id="ivaRate" formControlName="ivaRate" type="number" />
          </div>
          <div class="flex flex-col gap-2">
            <label hlmLabel for="ivaAmount">IVA Amount ({{ invoiceForm.get('currency')?.value }})</label>
            <input hlmInput id="ivaAmount" formControlName="ivaAmount" type="number" readonly/>
          </div>
          <div class="flex flex-col gap-2">
            <label hlmLabel for="irpfRate">IRPF Rate (%) </label>
            <input hlmInput id="irpfRate" formControlName="irpfRate" type="number" />
          </div>
          <div class="flex flex-col gap-2">
            <label hlmLabel for="irpfAmount">IRPF Amount ({{ invoiceForm.get('currency')?.value }})</label>
            <input hlmInput id="irpfAmount" formControlName="irpfAmount" type="number" readonly/>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-2">
          <label hlmLabel for="subtotal">Subtotal ({{ invoiceForm.get('currency')?.value }})</label>
          <input hlmInput id="subtotal" formControlName="subtotal" type="number" readonly/>
        </div>
        <div class="flex flex-col gap-2">
          <label hlmLabel for="total">Total ({{ invoiceForm.get('currency')?.value }})</label>
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

  get items() {
    return this.invoiceForm.get('items') as FormArray;
  }

  constructor(private invoiceService: InvoicesServiceService, private clientService: ClientService, private fb: FormBuilder, private router: Router) {
    this.invoiceForm = this.fb.group({
      invoiceNumber: ['', Validators.required],
      clientId: ['', Validators.required],
      clientName: ['', Validators.required],
      issueDate: [new Date().toISOString().slice(0, 10), Validators.required],
      dueDate: [new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().slice(0, 10), Validators.required],
      currency: ['EUR', Validators.required],
      subject: [''],
      ivaRate: [10, Validators.required],
      ivaAmount: [0, Validators.required],
      irpfRate: [15, Validators.required],
      irpfAmount: [0, Validators.required],
      notes: [''],
      items: this.fb.array([]),
      subtotal: [0, Validators.required],
      total: [0, Validators.required]
    });

    merge(
      this.items.valueChanges,
      this.invoiceForm.get('ivaRate')?.valueChanges || EMPTY,
      this.invoiceForm.get('irpfRate')?.valueChanges || EMPTY
    ).subscribe(() => {
      this.calculateTotals();
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

  createItem(): FormGroup {
    const itemGroup = this.fb.group({
      description: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      amount: [{ value: 0, disabled: true }]
    });

    merge(
      itemGroup.get('quantity')?.valueChanges || EMPTY,
      itemGroup.get('price')?.valueChanges || EMPTY
    ).subscribe(() => {
      const quantity = Number(itemGroup.get('quantity')?.value) || 0;
      const price = Number(itemGroup.get('price')?.value) || 0;
      itemGroup.patchValue({ amount: quantity * price }, { emitEvent: false });
      this.calculateTotals();
    });

    return itemGroup;
  }

  addItem() {
    const itemGroup = this.createItem();
    this.items.push(itemGroup);
    this.calculateTotals();
  }

  removeItem(index: number) {
    this.items.removeAt(index);
    this.calculateTotals();
  }

  calculateTotals() {
    const items = this.items.value as Item[];
    
    // Calculate line item amounts
    items.forEach((item, index) => {
      const amount = Number(item.quantity) * Number(item.price);
      this.items.at(index).patchValue({ amount }, { emitEvent: false });
    });

    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => {
      const amount = Number(item.quantity) * Number(item.price);
      return sum + amount;
    }, 0);
    
    // Calculate IVA and IRPF
    const ivaRate = Number(this.invoiceForm.get('ivaRate')?.value) || 0;
    const irpfRate = Number(this.invoiceForm.get('irpfRate')?.value) || 0;
    
    const ivaAmount = (subtotal * ivaRate) / 100;
    const irpfAmount = (subtotal * irpfRate) / 100;
    
    // Calculate total
    const total = Number((subtotal + ivaAmount - irpfAmount).toFixed(2));

    // Update form values
    this.invoiceForm.patchValue({
      subtotal,
      ivaAmount,
      irpfAmount,
      total
    }, { emitEvent: false });
  }

  onSubmit() {
    if (this.invoiceForm.valid) {      
      this.invoiceService.createInvoice(this.invoiceForm.value).pipe(
        take(1)
      ).subscribe({
        next: (invoice) => {
          if (invoice) {
            console.log('Invoice created successfully:', invoice);
            this.router.navigate(['/invoices']);
          }
        },
        error: (error) => {
          console.error('Error creating invoice:', error);
          // Re-enable the form on error
          this.invoiceForm.enable();
        },
        complete: () => {
          // Re-enable the form on completion
          this.invoiceForm.enable();
        }
      });
    }
  }
}
