import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HlmFormFieldModule } from '@spartan-ng/ui-formfield-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';

import { AuthService } from '../../../../core/auth/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [HlmFormFieldModule, HlmInputDirective, HlmButtonModule, ReactiveFormsModule],
  template: `
  <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
    <hlm-form-field>
      <input class="w-80" hlmInput type="email" placeholder="Email" formControlName="email"/>
      @if (registerForm.get('email')?.invalid) {
        <hlm-error>Tu email no es válido</hlm-error>
      }
      @if (registerForm.get('email')?.errors?.['required']) {
        <hlm-error>Tu email es requerido</hlm-error>
      }
    </hlm-form-field>
    <hlm-form-field>
      <input class="w-80" hlmInput type="password" placeholder="Contraseña" formControlName="password"/>
      @if (registerForm.get('password')?.touched && registerForm.get('password')?.errors?.['required']) {
        <hlm-error>Tu contraseña es requerida</hlm-error>
      }
    </hlm-form-field>
    @if (errorMessage) {
      <hlm-error>{{ errorMessage }}</hlm-error>
    }
    <button hlmBtn type="submit" [disabled]="registerForm.invalid">Signup</button>
  </form>
  `
})
export class RegisterComponent {

  constructor(private authService: AuthService, private router: Router) {}
  errorMessage = '';

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    if (this.registerForm.valid) {
      try {
        const { email, password } = this.registerForm.value;
        if (email && password) {
          this.authService.signUp(email, password).subscribe((next) => {
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
