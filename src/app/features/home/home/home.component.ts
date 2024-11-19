import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { ClockComponent } from '../components/clock/clock.component';
import { NgClass } from '@angular/common';
@Component({
  selector: 'app-home',
  standalone: true,
  host: {
    class:
      'flex md:flex-row flex-col items-center justify-center gap-12 h-[calc(100vh-10em)]',
  },
  imports: [ClockComponent, NgClass],
  template: `
    <h1
      class="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-10xl 
     font-pp-pangaia text-center cursor-default"
    >
      @for (char of hero; track char) {
      <span
        class="inline-block relative"
        (mouseenter)="char.hover = true"
        (mouseleave)="char.hover = false"
      >
        <span
          class="transition-opacity duration-300"
          [class.opacity-0]="char.hover"
        >
          {{ char.letter }}
        </span>
        <img
          [src]="char.hoverChar"
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          transition-opacity duration-300 opacity-0 h-[1em] w-auto object-cover overflow-visible"
          [class.opacity-100]="char.hover"
          alt=""
        />
      </span>
      }
    </h1>
    <span
      class="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-sans pt-0 md:pt-4
      "
    >
      Manage your
      <div class="h-[1em] relative">
        @for (title of currentTitle(); track title) {
        <span class="inline-block animate-slideUp">
          {{ title }}
        </span>
        }
      </div>
    </span>
    <!-- <app-clock
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    /> -->
  `,
})
export class HomeComponent implements OnInit, OnDestroy {
  hero = [
    { letter: 'T', hoverChar: '/archivo.webp', hover: false },
    { letter: 'e', hoverChar: '/money.webp', hover: false },
    { letter: 'm', hoverChar: '/rocket.webp', hover: false },
    { letter: 'p', hoverChar: '/compu.webp', hover: false },
    { letter: 'o', hoverChar: '/time.webp', hover: false },
  ];
  titles = ['time', 'clients', 'invoices'];
  currentTitle = signal(this.titles[0]);
  private subscription?: Subscription;

  ngOnInit() {
    this.subscription = interval(2800).subscribe(() => {
      this.currentTitle.update(
        (title) =>
          this.titles[(this.titles.indexOf(title) + 1) % this.titles.length]
      );
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
