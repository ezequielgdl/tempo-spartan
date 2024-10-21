import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HlmFormFieldModule } from '@spartan-ng/ui-formfield-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';

import {
  HlmCardContentDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';


import { AuthService } from '../../../../core/auth/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HlmFormFieldModule, HlmInputDirective, HlmButtonModule, ReactiveFormsModule, HlmCardDirective, HlmCardContentDirective, HlmCardFooterDirective, HlmCardHeaderDirective, HlmCardTitleDirective],
  host: {
    class: 'w-full'
  },
  template: `
  <section hlmCard>
    <div hlmCardHeader>
      <h3 hlmCardTitle>Login</h3>
      <p hlmCardDescription>Enter your email and password to log in.</p>
    </div>
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <p hlmCardContent>
        <hlm-form-field>
          <input class="w-full my-4" hlmInput type="email" placeholder="Email" formControlName="email"/>
          @if (loginForm.get('email')?.invalid) {
            <hlm-error>Your email is not valid</hlm-error>
          }
          @if (loginForm.get('email')?.errors?.['required']) {
            <hlm-error>Your email is required</hlm-error>
          }
        </hlm-form-field>
        <hlm-form-field>
          <input class="w-full my-4" hlmInput type="password" placeholder="Password" formControlName="password"/>
          @if (loginForm.get('password')?.touched && loginForm.get('password')?.errors?.['required']) {
            <hlm-error>Your password is required</hlm-error>
          }
        </hlm-form-field>
        @if (errorMessage) {
          <hlm-error>{{ errorMessage }}</hlm-error>
        }
      </p>
      <div hlmCardFooter>
        <button hlmBtn type="submit" [disabled]="loginForm.invalid">Login</button>
      </div>
    </form>
  </section>
  
  `
})
export class LoginComponent {

  constructor(private authService: AuthService, private router: Router) {}
  errorMessage = '';

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    if (this.loginForm.valid) {
      try {
        const { email, password } = this.loginForm.value;
        if (email && password) {
          this.authService.login(email, password).subscribe((next) => {
            if (next) {
              this.router.navigate(['/']);
            } else {
              this.errorMessage = 'Email o contraseña incorrectos';
            }
          });
        } else {
          console.error('Email y contraseña son requeridos');
        }
      } catch (error) {
        this.errorMessage = 'El email o la contraseña son incorrectos';
      }
    }
  }
}
