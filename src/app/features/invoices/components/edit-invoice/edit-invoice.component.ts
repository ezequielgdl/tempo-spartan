import { Component, Input, OnInit } from '@angular/core';
import { EditDialogComponent } from '../../../../shared/ui/edit-dialog/edit-dialog.component';
import { Invoice } from '../../interface';
import { InvoicesServiceService } from '../../services/invoices-service.service';
import { provideIcons } from '@ng-icons/core';
import { lucideEdit } from '@ng-icons/lucide';

@Component({
  selector: 'app-edit-invoice',
  standalone: true,
  imports: [EditDialogComponent],
  providers: [provideIcons({ lucideEdit })],
  template: `
    <app-edit-dialog 
      buttonText="Edit"
      title="Edit Client"
      description="Edit the client details here."
      [fields]="fields"
      saveButtonText="Save Changes"
      (save)="onSave($event)"
    />
  `
})
export class EditInvoiceComponent implements OnInit {
  @Input() invoice!: Invoice;
  fields: Array<{id: string, label: string, value: string | number}> = [];

  constructor(private invoiceService: InvoicesServiceService) {}

  ngOnInit(): void {
    this.initializeFields();
  }

  private initializeFields(): void {
    if (this.invoice) {
      this.fields = [
        { id: 'date', label: 'Date', value: this.invoice.date ?? '' },
        { id: 'invoiceNumber', label: 'Invoice Number', value: this.invoice.invoiceNumber ?? '' },
        { id: 'total', label: 'Total', value: this.invoice.total?.toString() ?? '' },
      ];
    } else {
      console.error('Invoice object is undefined');
    }
  }

  onSave(data: {[key: string]: string | number}): void {
    this.invoiceService.updateInvoice(data as unknown as Invoice).subscribe({
      next: (updatedInvoice) => {
        if (updatedInvoice) {
          this.invoice = updatedInvoice;
        }
      },
      error: (error) => console.error('Error updating invoice:', error)
    });
  }
}
