import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { UserService } from '../services/user.service';
import { UserInfo } from '../interface'
import { EditUserComponent } from '../components/edit-user/edit-user.component';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [HlmInputDirective, CommonModule, EditUserComponent, HlmButtonModule],
  template: `
    <h1>Hola, {{ user()?.name }}</h1>
    <pre>{{ user() | json }}</pre>
    @defer (when user()) {  
      <app-edit-user [user]="user()!"></app-edit-user>
    } @placeholder {
      <button hlmBtn>Loading...</button>
    }
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
