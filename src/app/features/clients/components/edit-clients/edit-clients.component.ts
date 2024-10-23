import { Component, Input, OnInit } from '@angular/core';
import { EditDialogComponent } from '../../../../shared/ui/edit-dialog/edit-dialog.component';
import { Client } from '../../interface';
import { ClientService } from '../../services/clients.service';
import { provideIcons } from '@ng-icons/core';
import { lucideEdit } from '@ng-icons/lucide';

@Component({
  selector: 'app-edit-clients',
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
export class EditClientsComponent implements OnInit {
  @Input() client!: Client;
  fields: Array<{id: string, label: string, value: string | number}> = [];

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.initializeFields();
  }

  private initializeFields(): void {
    if (this.client) {
      this.fields = [
        { id: 'name', label: 'Name', value: this.client.name ?? '' },
        { id: 'phone', label: 'Phone', value: this.client.phone ?? '' },
        { id: 'email', label: 'Email', value: this.client.email ?? '' },
        { id: 'address', label: 'Address', value: this.client.address ?? '' },
        { id: 'CIF', label: 'CIF', value: this.client.CIF ?? '' },
        { id: 'pricePerHour', label: 'Price per hour', value: this.client.pricePerHour?.toString() ?? '' },
      ];
    } else {
      console.error('Client object is undefined');
    }
  }

  onSave(data: {[key: string]: string | number}): void {
    this.clientService.updateClient(this.client.id, data).subscribe({
      next: (updatedClient) => {
        if (updatedClient) {
          this.client = updatedClient;
        }
      },
      error: (error) => console.error('Error updating client:', error)
    });
  }
}
