import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/services/auth.service';
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
import { UserService } from '../services/user.service';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
      @defer { @if (user()) {
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
      } } @loading {
      <div class="flex justify-center items-center h-full p-4">
        <hlm-spinner />
      </div>
      }
      <p hlmCardFooter>
        @defer { @if (user()) {
        <app-edit-user [user]="user()!"></app-edit-user>
        } } @placeholder {
        <button hlmBtn>Loading...</button>
        }
      </p>
    </section>
  `,
  styles: ``,
})
export class UserComponent {
  authService = inject(AuthService);
  userService = inject(UserService);
  userId = signal<string | null>(null);
  user = signal<UserInfo | null>(null);
  name = computed(() => this.user()?.name.split(' ')[0] ?? '');
  private destroy$ = new Subject<void>();

  ngOnInit() {
    combineLatest([
      this.authService.getCurrentUser(),
      this.userService.getUser(),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([authUser, userData]) => {
        if (!authUser) {
          this.user.set(null);
          this.userId.set(null);
          return;
        }

        if (userData) {
          this.user.set(userData);
          this.userId.set(userData.id);
        } else {
          this.userId.set(authUser.id);
          this.user.set({
            id: authUser.id,
            name: '',
            nif: '',
            address: '',
            phone: '',
            iban: '',
            website: '',
          });
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
