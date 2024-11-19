import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-clock',
  standalone: true,
  imports: [],
  template: `
    <div #clock class="relative w-24 h-24">
      <div
        class="absolute w-24 h-24 rounded-full border-4 border-current"
      ></div>
      <!-- @for (mark of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; track mark) {
      <div
        class="absolute w-1 h-1 bg-current"
        [style.transform]="
          'translate(-50%, -50%) rotate(' + mark * 30 + 'deg) translateY(58px)'
        "
        style="left: 50%; top: 50%;"
      ></div>
      } -->
      <div
        #centerDot
        class="absolute w-2 h-2 bg-current rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      ></div>
      <div
        #hourHand
        class="absolute w-1 h-6 bg-current bottom-1/2 left-1/2 -translate-x-1/2 origin-bottom transition-transform duration-250 rounded-full"
      ></div>
      <div
        #minuteHand
        class="absolute w-1 h-8 bg-current bottom-1/2 left-1/2 -translate-x-1/2 origin-bottom transition-transform duration-250 rounded-full"
      ></div>
    </div>
  `,
  styles: ``,
})
export class ClockComponent implements OnInit {
  @ViewChild('clock') clockElement!: ElementRef;
  @ViewChild('hourHand') hourHand!: ElementRef;
  @ViewChild('minuteHand') minuteHand!: ElementRef;

  ngOnInit() {
    document.addEventListener('mousemove', (e) => this.rotateHands(e));
  }

  private rotateHands(event: MouseEvent) {
    const clockRect = this.clockElement.nativeElement.getBoundingClientRect();
    const clockCenterX = clockRect.left + clockRect.width / 2;
    const clockCenterY = clockRect.top + clockRect.height / 2;

    const baseAngle =
      Math.atan2(event.clientY - clockCenterY, event.clientX - clockCenterX) *
        (180 / Math.PI) +
      90;

    // Hour hand rotates normally
    this.hourHand.nativeElement.style.transform = `translateX(-50%) rotate(${baseAngle}deg)`;

    // Minute hand rotates 3 times faster
    const minuteAngle = baseAngle * 3;
    this.minuteHand.nativeElement.style.transform = `translateX(-50%) rotate(${minuteAngle}deg)`;
  }
}
