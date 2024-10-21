import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { ClientsTableComponent } from '../components/clients-table/clients-table.component';
import { ClientService } from '../services/clients.service';
import { Client } from '../interface';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [ClientsTableComponent, JsonPipe],
  host: {
    class: 'block max-w-5xl mx-auto w-full p-4'
  },
  template: `
    <app-clients-table [clients]="clients()" />
    <pre>{{ clients() | json }}</pre>
  `,
  styles: ``
})
export class ClientsComponent {
  clients = signal<Client[]>([]);

  constructor(private clientService: ClientService) {}

  ngOnInit() {
    this.clientService.getClients().subscribe(clients => this.clients.set(clients));
  }
}
