import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HlmButtonModule],
  template: `
    <h1>Welcome to {{title}}!</h1>

    <router-outlet />
    <button hlmBtn>Click me</button>
  `,
  styles: [],
})
export class AppComponent {
  title = 'TempoUI';
}
