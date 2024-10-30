import { ChangeDetectionStrategy, Component, DestroyRef, Input, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ClientService } from '../../services/clients.service';
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
  selector: 'app-delete-client',
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
        id="delete-client" 
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
            This action cannot be undone. This will permanently delete this client and remove their data from our servers.
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
            (click)="onDelete(clientId, ctx)"
          >
            {{ isDeleting() ? 'Deleting...' : 'Delete Client' }}
          </button>
        </hlm-alert-dialog-footer>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>
  `,
})
export class DeleteClientComponent {
  @Input({ required: true }) clientId!: string;
  
  private readonly destroyRef = inject(DestroyRef);
  private readonly clientService = inject(ClientService);
  
  protected readonly isDeleting = signal(false);

  protected onDelete(clientId: string, ctx: { close: () => void }): void {
    this.isDeleting.set(true);
    
    this.clientService.deleteClient(clientId)
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
