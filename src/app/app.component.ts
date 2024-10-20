import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HlmButtonModule, NavbarComponent],
  template: `
    <app-navbar />
    <router-outlet />
  `,
  styles: [],
})
export class AppComponent {
}
