import { Component } from '@angular/core';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';


@Component({
  selector: 'app-user',
  standalone: true,
  imports: [HlmInputDirective],
  template: `
    <p>
      user works!
    </p>
    <input hlmInput/>
  `,
  styles: ``
})
export class UserComponent {

}
