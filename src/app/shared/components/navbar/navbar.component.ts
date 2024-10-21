
import { Component, Inject } from '@angular/core';
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
    HlmIconComponent
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
  <div>Tempo</div>
  @if (currentUser) {
    <div>
      <div class="flex w-full items-center justify-center">

      <button hlmBtn variant="outline" align="end" [brnMenuTriggerFor]="menu">Menu</button>
    </div>
    <ng-template #menu>
      <hlm-menu class="w-56">
        <hlm-menu-label>Tempo</hlm-menu-label>
        <hlm-menu-separator />
        <hlm-menu-group>
          <button hlmMenuItem routerLink="/user">
            <hlm-icon name="lucideUser" hlmMenuIcon />
            <span>Profile</span>
            <hlm-menu-shortcut>⇧⌘P</hlm-menu-shortcut>
          </button>

          <button hlmMenuItem routerLink="/user">
            <hlm-icon name="lucideLayers" hlmMenuIcon />
            <span>Clients</span>
            <hlm-menu-shortcut>⌘B</hlm-menu-shortcut>
          </button>

          <button hlmMenuItem routerLink="/user">
            <hlm-icon name="lucideBarChart" hlmMenuIcon />
            <span>Analytics</span>
            <hlm-menu-shortcut>⌘S</hlm-menu-shortcut>
          </button>

          <button hlmMenuItem routerLink="/user">
            <hlm-icon name="lucideFile" hlmMenuIcon />
            <span>Invoices</span>
            <hlm-menu-shortcut>⌘K</hlm-menu-shortcut>
          </button>
        </hlm-menu-group>

        <hlm-menu-separator />

        <button hlmMenuItem (click)="toggleTheme()">
            <hlm-icon name="lucideSunMoon" hlmMenuIcon />
            <span>Change Theme</span>
            <hlm-menu-shortcut>⌘T</hlm-menu-shortcut>
          </button>

        <hlm-menu-separator />

        <button hlmMenuItem (click)="logout()">
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

  currentUser: UserInfo | null = null;

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user as UserInfo | null;
    });
  }

  logout() {
    this.authService.logout();
  }

  toggleTheme() {
    this.themeService.toggleDarkMode();
  }
}
