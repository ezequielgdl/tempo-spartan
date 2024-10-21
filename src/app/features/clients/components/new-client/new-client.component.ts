import { Component } from '@angular/core';
import { EditDialogComponent } from '../../../../shared/ui/edit-dialog/edit-dialog.component';
import { ClientService } from '../../services/clients.service';
import { Client } from '../../interface';

@Component({
  selector: 'app-new-client',
  standalone: true,
  imports: [EditDialogComponent],
  template: `
    <app-edit-dialog 
      buttonText="New Client"
      title="Add Client"
      description="Add a new client here."
      [fields]="fields"
      saveButtonText="Add Client"
      (save)="onSave($event)"
    />
  `,
  styles: ``
})
export class NewClientComponent {
  fields: Array<{id: string, label: string, value: string}> = [];

  constructor(private clientService: ClientService) {}

  ngOnInit() {
    this.fields = [
      { id: 'name', label: 'Name', value: '' },
      { id: 'email', label: 'Email', value: '' },
      { id: 'phone', label: 'Phone', value: '' },
      { id: 'address', label: 'Address', value: '' },
      { id: 'CIF', label: 'CIF', value: '' },
      { id: 'pricePerHour', label: 'Price Per Hour', value: '' },
    ];
  }

  onSave(event: any) {
    this.clientService.createClient(event).subscribe(); 
  }
}
