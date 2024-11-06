import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { ThemeService } from '../theme/theme.service';

@Injectable({
  providedIn: 'root'
})
export class KeyboardShortcutsService {
  constructor(
    private router: Router,
    private authService: AuthService,
    private themeService: ThemeService
  ) {}

  handleKeyboardShortcut(event: KeyboardEvent) {
    // Check if Command (Mac) or Control (Windows) is pressed
    const cmdOrCtrl = event.metaKey || event.ctrlKey;
    
    // Only proceed if cmd/ctrl is pressed
    if (!cmdOrCtrl) return;

    switch (event.key.toLowerCase()) {
      case 'p':
        if (event.shiftKey) {
          event.preventDefault();
          this.router.navigate(['/user']);
        }
        break;
      case 'c': // ⌘C
        event.preventDefault();
        this.router.navigate(['/clients']);
        break;
      case 'a': // ⌘A
        if (event.shiftKey) {
          event.preventDefault();
          this.router.navigate(['/analytics']);
        }
        break;  
      case 'i': // ⌘I
        event.preventDefault();
        this.router.navigate(['/invoices']);
        break;
      case 'o': // ⇧⌘O
        if (event.shiftKey) {
          event.preventDefault();
          this.themeService.toggleDarkMode();
        }
        break;
      case 'q': // ⇧⌘Q
        if (event.shiftKey) {
          event.preventDefault();
          this.authService.logout();
        }
        break;
    }
  }
} 