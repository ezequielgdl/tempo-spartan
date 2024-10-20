import { Component, signal } from '@angular/core';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { UserService } from '../services/user.service';
import { UserInfo } from '../interface'

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [HlmInputDirective],
  template: `
    <h1>Hola, {{ user()?.name }}</h1>
  `,
  styles: ``
})
export class UserComponent {

user = signal<UserInfo | null>(null);

constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUser().subscribe((user) => {
      this.user.set(user);
    });
  }

}
