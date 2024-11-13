import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { UserInfo } from '../interface';
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
import { hlmMuted } from '@spartan-ng/ui-typography-helm';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';
@Component({
  selector: 'app-user',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HlmInputDirective,
    CommonModule,
    EditUserComponent,
    HlmButtonModule,
    HlmCardContentDirective,
    HlmCardDescriptionDirective,
    HlmCardDirective,
    HlmCardFooterDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmSpinnerComponent,
  ],
  host: {
    class: 'block max-w-lg mx-auto w-full p-4',
  },
  template: `
    <section hlmCard>
      @defer {
      <div hlmCardHeader>
        <h3 hlmCardTitle>Hi, {{ name() }}</h3>
        <p hlmCardDescription>Your profile details</p>
      </div>
      <div hlmCardContent class="flex flex-col gap-8 mb-4">
        <div>
          <p class="${hlmMuted}">NIF</p>
          <div class="w-full h-px bg-border my-1"></div>
          <p class="">{{ user()?.nif }}</p>
        </div>
        <div>
          <p class="${hlmMuted}">Address</p>
          <div class="w-full h-px bg-border my-1"></div>
          <p class="">{{ user()?.address }}</p>
        </div>
        <div>
          <p class="${hlmMuted}">Phone</p>
          <div class="w-full h-px bg-border my-1"></div>
          <p class="">{{ user()?.phone }}</p>
        </div>
        <div>
          <p class="${hlmMuted}">IBAN</p>
          <div class="w-full h-px bg-border my-1"></div>
          <p class="">{{ user()?.iban }}</p>
        </div>
        <div>
          <p class="${hlmMuted}">Website</p>
          <div class="w-full h-px bg-border my-1"></div>
          <p class="">{{ user()?.website }}</p>
        </div>
      </div>
      } @loading (minimum 200ms) {
      <div class="flex justify-center items-center h-full p-4">
        <hlm-spinner />
      </div>
      }
      <p hlmCardFooter>
        @defer (when user()) {
        <app-edit-user [user]="user()!"></app-edit-user>
        } @placeholder {
        <button hlmBtn>Loading...</button>
        }
      </p>
    </section>
  `,
  styles: ``,
})
export class UserComponent {
  user = signal<UserInfo | null>(null);
  name = computed(() => this.user()?.name.split(' ')[0]);

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUser().subscribe((user) => {
      this.user.set(user);
    });
  }
}
