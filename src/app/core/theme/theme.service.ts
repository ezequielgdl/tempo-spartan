import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(this.getInitialTheme());
  public isDarkMode$ = this.darkMode.asObservable();

  constructor() {
    this.updateTheme();
  }

  toggleDarkMode() {
    this.darkMode.next(!this.darkMode.value);
    localStorage.setItem('darkMode', JSON.stringify(this.darkMode.value));
    this.updateTheme();
  }

  private getInitialTheme(): boolean {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  }

  private updateTheme() {
    if (this.darkMode.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
