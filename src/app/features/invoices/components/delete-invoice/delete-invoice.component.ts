import { ChangeDetectionStrategy, Component, DestroyRef, Input, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { signal } from '@angular/core';

@Component({
  selector: 'app-delete-invoice',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BrnAlertDialogComponent, 
    BrnAlertDialogContentDirective, 
    BrnAlertDialogTriggerDirective,
    HlmAlertDialogActionButtonDirective,
    HlmAlertDialogCancelButtonDirective,
    HlmAlertDialogDescriptionDirective,
    HlmAlertDialogFooterComponent,
    HlmAlertDialogHeaderComponent,
    HlmAlertDialogOverlayDirective,
    HlmAlertDialogTitleDirective,
    HlmAlertDialogContentComponent,
    HlmAlertDialogComponent,
    HlmButtonDirective
  ],
  template: `
    <hlm-alert-dialog>
      <button 
        id="delete-invoice" 
        brnAlertDialogTrigger 
        hlmBtn 
        [disabled]="isDeleting()"
      >
        {{ isDeleting() ? 'Deleting...' : 'Delete' }}
      </button>
      <hlm-alert-dialog-content *brnAlertDialogContent="let ctx">
        <hlm-alert-dialog-header>
          <h3 hlmAlertDialogTitle>Are you absolutely sure?</h3>
          <p hlmAlertDialogDescription>
            This action cannot be undone. This will permanently delete this invoice and remove their data from our servers.
          </p>
        </hlm-alert-dialog-header>
        <hlm-alert-dialog-footer>
          <button 
            hlmAlertDialogCancel 
            [disabled]="isDeleting()" 
            (click)="ctx.close()"
          >
            Cancel
          </button>
          <button 
            hlmAlertDialogAction 
            [disabled]="isDeleting()"
            (click)="onDelete(invoiceId, ctx)"
          >
            {{ isDeleting() ? 'Deleting...' : 'Delete Invoice' }}
          </button>
        </hlm-alert-dialog-footer>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>
  `,
})
export class DeleteInvoiceComponent {
  @Input({ required: true }) invoiceId!: string;
  
  private readonly destroyRef = inject(DestroyRef);
  private readonly invoiceService = inject(InvoicesServiceService);
  
  protected readonly isDeleting = signal(false);

  protected onDelete(invoiceId: string, ctx: { close: () => void }): void {
    this.isDeleting.set(true);
    
    this.invoiceService.deleteInvoice(invoiceId)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.isDeleting.set(false);
          ctx.close();
        },
        error: () => {
          this.isDeleting.set(false);
          // Could add error handling here
        }
      });
  }
}
