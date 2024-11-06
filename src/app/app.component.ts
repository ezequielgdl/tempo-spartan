import { Component, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { KeyboardShortcutsService } from './core/keyboard/keyboard-shortcuts.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HlmButtonModule, NavbarComponent],
  template: `
    <app-navbar />
    <router-outlet />
  `,
  styles: [],
})
export class AppComponent {
  private readonly keyboardShortcuts = inject(KeyboardShortcutsService);

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.keyboardShortcuts.handleKeyboardShortcut(event);
  }
}
