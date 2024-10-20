import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HlmButtonModule],
  template: `
    <router-outlet />
  `,
  styles: [],
})
export class AppComponent {
}
