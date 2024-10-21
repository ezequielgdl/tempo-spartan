import { Component, Input } from '@angular/core';
import { Client } from '../../interface';
import { EditClientsComponent } from '../edit-clients/edit-clients.component';
import {
  HlmCaptionComponent,
  HlmTableComponent,
  HlmTdComponent,
  HlmThComponent,
  HlmTrowComponent,
} from '@spartan-ng/ui-table-helm';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { lucideEdit } from '@ng-icons/lucide';


@Component({
  selector: 'app-clients-table',
  standalone: true,
  providers: [
    provideIcons({
      lucideEdit
    })
  ],
  host: {
    class: 'w-full'
  },
  imports: [HlmCaptionComponent, HlmTableComponent, HlmTdComponent, HlmThComponent, HlmTrowComponent, HlmIconComponent, EditClientsComponent],
  template: `
    <hlm-table class="w-full">
      <hlm-caption>A list of your clients.</hlm-caption>
      <hlm-trow>
        <hlm-th class="w-1/2">Client</hlm-th>
        <hlm-th class="w-1/2 flex justify-end">Actions</hlm-th>
      </hlm-trow>
      @for (client of clients; track client.id) {
        <hlm-trow>
          <hlm-td class="w-1/2">{{ client.name }}</hlm-td>
          <hlm-td class="w-1/2 flex justify-end">
              <app-edit-clients [client]="client" />
          </hlm-td>
        </hlm-trow>
      }
    </hlm-table>
  `,
  styles: ``
})
export class ClientsTableComponent {
  @Input() clients: Client[] = [];  
}
