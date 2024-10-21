import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { UserInfo } from '../interface'
import { EditUserComponent } from '../components/edit-user/edit-user.component';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';
import { hlmMuted, hlmSmall } from '@spartan-ng/ui-typography-helm';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [HlmInputDirective, CommonModule, EditUserComponent, HlmButtonModule, HlmCardContentDirective, HlmCardDescriptionDirective, HlmCardDirective, HlmCardFooterDirective, HlmCardHeaderDirective, HlmCardTitleDirective],
  host: {
    class: 'block max-w-lg mx-auto w-full p-4'
  },
  template: `

<section hlmCard>
  <div hlmCardHeader>
    <h3 hlmCardTitle>Hi, {{ user()?.name }}</h3>
    <p hlmCardDescription>Your profile</p>
  </div>
  <div hlmCardContent>
      <p class="${hlmSmall} my-4">NIF: {{ user()?.nif }}</p>
      <p class="${hlmSmall} my-4">Address: {{ user()?.address }}</p>
      <p class="${hlmSmall} my-4">Phone: {{ user()?.phone }}</p>
      <p class="${hlmSmall} my-4">IBAN: {{ user()?.iban }}</p>
      <p class="${hlmSmall} my-4">Website: {{ user()?.website }}</p>
</div>
  <p hlmCardFooter>
  @defer (when user()) {  
      <app-edit-user [user]="user()!"></app-edit-user>
    } @placeholder {
        <button hlmBtn>Loading...</button>
      }
    </p>
  </section>
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
