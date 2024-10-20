import { Component } from '@angular/core';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [HlmInputDirective],
  template: `
    <input hlmInput/>
  `,
  styles: ``
})
export class UserComponent {

constructor(private userService: UserService) {}

}
