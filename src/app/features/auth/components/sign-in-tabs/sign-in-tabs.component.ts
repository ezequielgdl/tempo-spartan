import { Component } from '@angular/core';
import { LoginComponent } from '../login/login.component';
// import { SignupComponent } from '../signup/signup.component';
import {
	HlmTabsComponent,
	HlmTabsContentDirective,
	HlmTabsListComponent,
	HlmTabsTriggerDirective,
} from '@spartan-ng/ui-tabs-helm';


@Component({
  selector: 'app-sign-in-tabs',
  standalone: true,
  imports: [HlmTabsComponent, HlmTabsContentDirective, HlmTabsListComponent, HlmTabsTriggerDirective, LoginComponent],
  template: `
    <hlm-tabs tab='login' class='block max-w-3xl mx-auto'>
      <hlm-tabs-list class='w-full grid grid-cols-2' aria-label='Login or Signup'>
        <button hlmTabsTrigger='login'>Login</button>
        <button hlmTabsTrigger='signup'>Signup</button>
      </hlm-tabs-list>
      <div hlmTabsContent='login'>
        <app-login></app-login>
      </div>
      <div hlmTabsContent='signup'>
        <!-- <app-signup></app-signup> -->
      </div>
    </hlm-tabs>
  `,
  styles: ``
})
export class SignInTabsComponent {

}
