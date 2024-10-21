import { Component, Input } from '@angular/core';
import { EditDialogComponent } from '../../../../shared/ui/edit-dialog/edit-dialog.component';
import { Client } from '../../interface';
import { ClientService } from '../../services/clients.service';
import { provideIcons } from '@ng-icons/core';
import { lucideEdit } from '@ng-icons/lucide';

@Component({
  selector: 'app-edit-clients',
  standalone: true,
  providers: [provideIcons({ lucideEdit })],
  imports: [EditDialogComponent],
  template: `
    <app-edit-dialog 
      [buttonText]="'Edit'"
      [title]="'Edit Client'"
      [description]="'Edit the client details here.'"
      [fields]="fields"
      [saveButtonText]="'Save Changes'"
      (save)="onSave($event)"
    /> 
  `,
  styles: ``
})
export class EditClientsComponent {
  @Input() client!: Client;
  fields: Array<{id: string, label: string, value: string}> = [];

  constructor(private clientService: ClientService) {}

  ngOnInit() {
    this.initializeFields();
  }

  initializeFields() {
    this.fields = [
      {id: 'name', label: 'Name', value: this.client.name ?? ''},
      {id: 'phone', label: 'Phone', value: this.client.phone ?? ''},
      {id: 'email', label: 'Email', value: this.client.email ?? ''},
      {id: 'address', label: 'Address', value: this.client.address ?? ''},
      {id: 'CIF', label: 'CIF', value: this.client.CIF ?? ''},
      {id: 'pricePerHour', label: 'Price per hour', value: this.client.pricePerHour?.toString() ?? ''},
    ];
  }

  onSave(data: {[key: string]: string}) {
    this.clientService.updateClient(this.client.id, data).subscribe((client) => {
      this.client = client!;
    });
  }
}
