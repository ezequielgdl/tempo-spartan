import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { ClientsTableComponent } from '../components/clients-table/clients-table.component';
import { ClientService } from '../services/clients.service';
import { Client } from '../interface';
import { NewClientComponent } from '../components/new-client/new-client.component';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [ClientsTableComponent, JsonPipe, NewClientComponent, HlmSpinnerComponent],
  host: {
    class: 'block max-w-5xl mx-auto w-full p-4 flex flex-col gap-6'
  },
  template: `
    <app-new-client />
    @defer {
      <app-clients-table [clients]="clients()" />
    } @loading (minimum 300ms) {
      <div class="flex justify-center items-center h-full">
        <hlm-spinner />
      </div>
    }
  `
})
export class ClientsComponent {
  clients = signal<Client[]>([]);

  constructor(private clientService: ClientService) {}

  ngOnInit() {
    this.clientService.getClients().subscribe(clients => this.clients.set(clients));
  }
}
