import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
    localStorage.removeItem('darkMode');
    document.documentElement.classList.remove('dark');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should toggle dark mode', () => {
    service.toggleDarkMode();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('darkMode')).toBe('true');

    service.toggleDarkMode();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('darkMode')).toBe('false');
  });
});
