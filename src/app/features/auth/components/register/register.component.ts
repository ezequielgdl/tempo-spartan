import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
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
  selector: 'app-register',
  standalone: true,
  imports: [
    HlmFormFieldModule,
    HlmInputDirective,
    HlmButtonModule,
    ReactiveFormsModule,
    HlmCardDirective,
    HlmCardContentDirective,
    HlmCardFooterDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
  ],
  template: `
    <section hlmCard>
      <div hlmCardHeader>
        <h3 hlmCardTitle>Register</h3>
        <p hlmCardDescription>
          Enter your email and password to create an account.
        </p>
      </div>
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <div hlmCardContent>
          <hlm-form-field>
            <input
              class="w-full my-4"
              hlmInput
              type="email"
              placeholder="Email"
              formControlName="email"
            />
            @if (registerForm.get('email')?.invalid) {
            <hlm-error>Your email is not valid</hlm-error>
            } @if (registerForm.get('email')?.errors?.['required']) {
            <hlm-error>Your email is required</hlm-error>
            }
          </hlm-form-field>
          <hlm-form-field>
            <input
              class="w-full my-4"
              hlmInput
              type="password"
              placeholder="Password"
              formControlName="password"
            />
            @if (registerForm.get('password')?.touched &&
            registerForm.get('password')?.errors?.['required']) {
            <hlm-error>Your password is required</hlm-error>
            }
          </hlm-form-field>
          <hlm-form-field>
            <input
              class="w-full my-4"
              hlmInput
              type="password"
              placeholder="Confirm Password"
              formControlName="confirmPassword"
            />
          </hlm-form-field>
          @if (registerForm.errors?.['passwordsMismatch']) {
          <hlm-error>Passwords don't match</hlm-error>
          } @if (errorMessage) {
          <hlm-error>{{ errorMessage }}</hlm-error>
          }
        </div>
        <div hlmCardFooter>
          <button hlmBtn type="submit" [disabled]="registerForm.invalid">
            Sign Up
          </button>
        </div>
      </form>
    </section>
  `,
})
export class RegisterComponent {
  constructor(private authService: AuthService, private router: Router) {}
  errorMessage = '';

  registerForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: this.passwordsMatchValidator.bind(this) }
  );

  private passwordsMatchValidator(
    form: AbstractControl
  ): { [key: string]: boolean } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;
      if (email && password) {
        this.authService.signUp(email, password).subscribe({
          next: (user) => {
            if (user) {
              this.router.navigate(['/user']);
            } else {
              this.errorMessage = 'Email o contraseña incorrectos';
            }
          },
          error: (error) => {
            this.errorMessage = error;
          },
        });
      }
    }
  }
}
