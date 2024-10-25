import { Component, computed, Input, signal } from '@angular/core';
import { Invoice } from '../../interface';
import { InvoicesServiceService } from '../../services/invoices-service.service';

import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { BrnDialogContentDirective, BrnDialogTriggerDirective } from '@spartan-ng/ui-dialog-brain';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { ActivatedRoute } from '@angular/router';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-edit-invoice',
  standalone: true,
  imports: [
    HlmButtonDirective,
    BrnDialogContentDirective,
    BrnDialogTriggerDirective,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogDescriptionDirective,
    HlmDialogFooterComponent,
    HlmDialogHeaderComponent,
    HlmDialogTitleDirective,
    HlmInputDirective,
    HlmLabelDirective,
    JsonPipe
  ],
  template: `
  {{ invoice() | json }}

  `
})
export class EditInvoiceComponent {
  invoice = signal<Invoice | null>(null);
  timers = computed(() => this.invoice()?.timers);

  constructor(private invoiceService: InvoicesServiceService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.invoiceService.getInvoiceById(params['id']).subscribe(invoice => this.invoice.set(invoice));
    });
  }
}
