import { Component } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import {
	HlmTabsComponent,
	HlmTabsContentDirective,
	HlmTabsListComponent,
	HlmTabsTriggerDirective,
} from '@spartan-ng/ui-tabs-helm';


@Component({
  selector: 'app-sign-in-tabs',
  standalone: true,
  imports: [HlmTabsComponent, HlmTabsContentDirective, HlmTabsListComponent, HlmTabsTriggerDirective, LoginComponent, RegisterComponent],
  template: `
    <hlm-tabs tab='login' class='block max-w-3xl mx-auto w-full p-4'>
      <hlm-tabs-list class='w-full grid grid-cols-2' aria-label='Login or Signup'>
        <button hlmTabsTrigger='login'>Login</button>
        <button hlmTabsTrigger='register'>Signup</button>
      </hlm-tabs-list>
      <div hlmTabsContent='login'>
        <app-login></app-login>
      </div>
      <div hlmTabsContent='register'>
        <app-register></app-register>
      </div>
    </hlm-tabs>
  `,
  styles: ``
})
export class SignInTabsComponent {

}
