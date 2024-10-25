import { Component, Input } from '@angular/core';
import { Invoice } from '../../interface';
import { InvoicesServiceService } from '../../services/invoices-service.service';
import { BrnAlertDialogComponent, BrnAlertDialogContentDirective, BrnAlertDialogTriggerDirective } from '@spartan-ng/ui-alertdialog-brain';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
  HlmAlertDialogActionButtonDirective,
  HlmAlertDialogCancelButtonDirective,
  HlmAlertDialogComponent,
  HlmAlertDialogContentComponent,
  HlmAlertDialogDescriptionDirective,
  HlmAlertDialogFooterComponent,
  HlmAlertDialogHeaderComponent,
  HlmAlertDialogOverlayDirective,
  HlmAlertDialogTitleDirective,
} from '@spartan-ng/ui-alertdialog-helm';

@Component({
  selector: 'app-delete-invoice',
  standalone: true,
  imports: [BrnAlertDialogComponent, BrnAlertDialogContentDirective, BrnAlertDialogTriggerDirective, HlmAlertDialogActionButtonDirective, HlmAlertDialogCancelButtonDirective, HlmAlertDialogDescriptionDirective, HlmAlertDialogFooterComponent, HlmAlertDialogHeaderComponent, HlmAlertDialogOverlayDirective, HlmAlertDialogTitleDirective, HlmAlertDialogContentComponent, HlmAlertDialogComponent, HlmButtonDirective],
  template: `
    <hlm-alert-dialog>
     <button id="delete-invoice" brnAlertDialogTrigger hlmBtn>Delete</button>
      <hlm-alert-dialog-content *brnAlertDialogContent="let ctx">
        <hlm-alert-dialog-header>
          <h3 hlmAlertDialogTitle>Are you absolutely sure?</h3>
          <p hlmAlertDialogDescription>
            This action cannot be undone. This will permanently delete this invoice and remove their data from our servers.
          </p>
        </hlm-alert-dialog-header>
        <hlm-alert-dialog-footer>
          <button hlmAlertDialogCancel (click)="ctx.close()">Cancel</button>
          <button hlmAlertDialogAction (click)="onDelete(invoiceId); ctx.close()">Delete Invoice</button>
        </hlm-alert-dialog-footer>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>
  `,
})
export class DeleteInvoiceComponent {
  @Input() invoiceId!: string;

  constructor(private invoiceService: InvoicesServiceService) {}

  onDelete(invoiceId: string): void {
    this.invoiceService.deleteInvoice(invoiceId).subscribe(() => {
      this.invoiceService.invoices$.subscribe();
    });
  }
}
