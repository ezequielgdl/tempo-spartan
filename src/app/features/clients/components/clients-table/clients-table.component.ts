import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Client } from '../../interface';
import { EditClientsComponent } from '../edit-clients/edit-clients.component';
import { DeleteClientComponent } from '../delete-client/delete-client.component';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({
      lucideEdit,
    }),
  ],
  host: {
    class: 'w-full',
  },
  imports: [
    HlmCaptionComponent,
    HlmTableComponent,
    HlmTdComponent, // Used by Spartan Library
    HlmThComponent, // Used by Spartan Library
    HlmTrowComponent, // Used by Spartan Library
    HlmIconComponent, // Used by Spartan Library
    EditClientsComponent,
    DeleteClientComponent,
  ],
  template: `
    <div class="overflow-x-auto">
      <hlm-table class="min-w-full">
        <hlm-caption>A list of your clients.</hlm-caption>
        <hlm-trow>
          <hlm-th class="w-3/4">Client</hlm-th>
          <hlm-th class="w-1/4 flex">Actions</hlm-th>
        </hlm-trow>
        @for (client of clients; track client.id) {
        <hlm-trow>
          <hlm-td class="w-3/4">{{ client.name }}</hlm-td>
          <hlm-td class="w-1/4 flex gap-2">
            <app-edit-clients [client]="client" />
            <app-delete-client [clientId]="client.id" />
          </hlm-td>
        </hlm-trow>
        }
      </hlm-table>
    </div>
  `,
})
export class ClientsTableComponent {
  @Input() clients: Client[] = [];
}
