
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';
import { ThemeService } from '../../../core/theme/theme.service';
import { provideIcons } from '@ng-icons/core';
import {
  lucideLayers,
  lucideLogOut,
  lucideUser,
  lucideFile,
  lucideBarChart,
  lucideSunMoon
} from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import {
  HlmMenuComponent,
  HlmMenuGroupComponent,
  HlmMenuItemDirective,
  HlmMenuItemIconDirective,
  HlmMenuItemSubIndicatorComponent,
  HlmMenuLabelComponent,
  HlmMenuSeparatorComponent,
  HlmMenuShortcutComponent,
  HlmSubMenuComponent,
} from '@spartan-ng/ui-menu-helm';
import { UserInfo } from '../../../features/user/interface';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    BrnMenuTriggerDirective,
    HlmMenuComponent,
    HlmSubMenuComponent,
    HlmMenuItemDirective,
    HlmMenuItemSubIndicatorComponent,
    HlmMenuLabelComponent,
    HlmMenuShortcutComponent,
    HlmMenuSeparatorComponent,
    HlmMenuItemIconDirective,
    HlmMenuGroupComponent,
    HlmButtonDirective,
    HlmIconComponent,
    RouterLink
  ],
  providers: [
    provideIcons({
      lucideUser,
      lucideLayers,
      lucideLogOut,
      lucideFile,
      lucideBarChart,
      lucideSunMoon
    }),
  ],
  host: {
    class: 'flex w-full items-center justify-between p-4'
  },
  template: `
  <div class="font-pp-pangaia font-bold text-xl" id="tempo-logo" aria-label="Tempo logo">Tempo</div>
  @if (currentUser) {
    <div>
      <div class="flex w-full items-center justify-center">
      <button id="menu-trigger" hlmBtn variant="ghost" align="end" [brnMenuTriggerFor]="menu" aria-label="Open menu">Menu</button>
    </div>
    <ng-template #menu>
      <hlm-menu class="w-56" role="menu" aria-label="Navigation menu">
        <hlm-menu-label id="menu-label">Tempo</hlm-menu-label>
        <hlm-menu-separator />
        <hlm-menu-group>
          <button id="profile-menu-item" hlmMenuItem routerLink="/user" role="menuitem" aria-label="Go to profile">
            <hlm-icon name="lucideUser" hlmMenuIcon />
            <span>Profile</span>
            <hlm-menu-shortcut>⇧⌘P</hlm-menu-shortcut>
          </button>

          <button id="clients-menu-item" hlmMenuItem routerLink="/clients" role="menuitem" aria-label="Go to clients">
            <hlm-icon name="lucideLayers" hlmMenuIcon />
            <span>Clients</span>
            <hlm-menu-shortcut>⌘B</hlm-menu-shortcut>
          </button>

          <button id="analytics-menu-item" hlmMenuItem routerLink="/user" role="menuitem" aria-label="Go to analytics">
            <hlm-icon name="lucideBarChart" hlmMenuIcon />
            <span>Analytics</span>
            <hlm-menu-shortcut>⌘S</hlm-menu-shortcut>
          </button>

          <button id="invoices-menu-item" hlmMenuItem routerLink="/user" role="menuitem" aria-label="Go to invoices">
            <hlm-icon name="lucideFile" hlmMenuIcon />
            <span>Invoices</span>
            <hlm-menu-shortcut>⌘K</hlm-menu-shortcut>
          </button>
        </hlm-menu-group>

        <hlm-menu-separator />

        <button id="theme-toggle-menu-item" hlmMenuItem (click)="toggleTheme()" role="menuitem" aria-label="Toggle theme">
            <hlm-icon name="lucideSunMoon" hlmMenuIcon />
            <span>Change Theme</span>
            <hlm-menu-shortcut>⌘T</hlm-menu-shortcut>
          </button>

        <hlm-menu-separator />

        <button id="logout-menu-item" hlmMenuItem (click)="logout()" role="menuitem" aria-label="Logout">
          <hlm-icon name="lucideLogOut" hlmMenuIcon />
          <span>Logout</span>
          <hlm-menu-shortcut>⇧⌘Q</hlm-menu-shortcut>
        </button>
      </hlm-menu>
      </ng-template>
    </div>
  }
  `,
})
export class NavbarComponent {
  constructor(private authService: AuthService, private themeService: ThemeService) {}

  currentUser: User | null = null;

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user as User | null;
    });
  }

  logout() {
    this.authService.logout();
  }

  toggleTheme() {
    this.themeService.toggleDarkMode();
  }
}
