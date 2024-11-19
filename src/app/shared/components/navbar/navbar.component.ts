import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';
import { ThemeService } from '../../../core/theme/theme.service';
import { provideIcons } from '@ng-icons/core';
import {
  lucideLayers,
  lucideLogOut,
  lucideUser,
  lucideFile,
  lucideBarChart,
  lucideSunMoon,
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
import { NgClass } from '@angular/common';
import { Subscription } from 'rxjs';
import { UserService } from '../../../features/user/services/user.service';

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
    RouterLink,
    NgClass,
  ],
  providers: [
    provideIcons({
      lucideUser,
      lucideLayers,
      lucideLogOut,
      lucideFile,
      lucideBarChart,
      lucideSunMoon,
    }),
  ],
  host: {
    class: 'flex w-full items-center justify-between px-5 py-2',
  },
  template: `
    <div
      class="font-pp-pangaia text-xl cursor-pointer"
      id="tempo-logo"
      aria-label="Tempo logo"
      [routerLink]="'/home'"
    >
      @if (showHero) { Tempo }
    </div>
    @if (currentUser) {
    <div>
      <div class="flex w-full items-center justify-center">
        <button
          id="menu-trigger"
          hlmBtn
          variant="ghost"
          align="end"
          [brnMenuTriggerFor]="menu"
          aria-label="Open menu"
        >
          Menu
        </button>
      </div>
      <ng-template #menu>
        <hlm-menu class="w-56" role="menu" aria-label="Navigation menu">
          <hlm-menu-label id="menu-label">Tempo</hlm-menu-label>
          <hlm-menu-separator />
          <hlm-menu-group>
            <button
              id="profile-menu-item"
              hlmMenuItem
              routerLink="/user"
              role="menuitem"
              aria-label="Go to profile"
            >
              <hlm-icon name="lucideUser" hlmMenuIcon />
              <span>Profile</span>
              <hlm-menu-shortcut>⇧⌘P</hlm-menu-shortcut>
            </button>

            <button
              id="clients-menu-item"
              hlmMenuItem
              routerLink="/clients"
              role="menuitem"
              aria-label="Go to clients"
            >
              <hlm-icon name="lucideLayers" hlmMenuIcon />
              <span>Clients</span>
              <hlm-menu-shortcut>⌘C</hlm-menu-shortcut>
            </button>

            <button
              id="analytics-menu-item"
              hlmMenuItem
              routerLink="/analytics"
              role="menuitem"
              aria-label="Go to analytics"
            >
              <hlm-icon name="lucideBarChart" hlmMenuIcon />
              <span>Analytics</span>
              <hlm-menu-shortcut>⇧⌘A</hlm-menu-shortcut>
            </button>

            <button
              id="invoices-menu-item"
              hlmMenuItem
              routerLink="/invoices"
              role="menuitem"
              aria-label="Go to invoices"
            >
              <hlm-icon name="lucideFile" hlmMenuIcon />
              <span>Invoices</span>
              <hlm-menu-shortcut>⌘I</hlm-menu-shortcut>
            </button>
          </hlm-menu-group>

          <hlm-menu-separator />

          <button
            id="theme-toggle-menu-item"
            hlmMenuItem
            (click)="toggleTheme()"
            role="menuitem"
            aria-label="Toggle theme"
          >
            <hlm-icon name="lucideSunMoon" hlmMenuIcon />
            <span>Change Theme</span>
            <hlm-menu-shortcut>⇧⌘O</hlm-menu-shortcut>
          </button>

          <hlm-menu-separator />

          <button
            id="logout-menu-item"
            hlmMenuItem
            (click)="logout()"
            role="menuitem"
            aria-label="Logout"
          >
            <hlm-icon name="lucideLogOut" hlmMenuIcon />
            <span>Logout</span>
            <hlm-menu-shortcut>⇧⌘Q</hlm-menu-shortcut>
          </button>
        </hlm-menu>
      </ng-template>
    </div>
    } @else {
    <button hlmBtn routerLink="/enter">Login</button>
    }
  `,
})
export class NavbarComponent {
  private subscriptions: Subscription[] = [];
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);
  private userService = inject(UserService);
  currentUser: User | null = null;
  private router = inject(Router);
  showHero = false;

  ngOnInit() {
    this.subscriptions.push(
      this.authService.getCurrentUser().subscribe((user) => {
        this.currentUser = user as User | null;
      })
    );

    this.subscriptions.push(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.showHero = event.url !== '/home' && event.url !== '/';
        }
      })
    );
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
    this.userService.clearUser();
  }

  toggleTheme() {
    this.themeService.toggleDarkMode();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
