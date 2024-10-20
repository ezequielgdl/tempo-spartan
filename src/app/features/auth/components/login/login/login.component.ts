import { Component } from '@angular/core';
import { HlmFormFieldModule } from '@spartan-ng/ui-formfield-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../../../core/auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HlmFormFieldModule, HlmInputDirective, HlmButtonModule, ReactiveFormsModule],
  template: `
  <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
    <hlm-form-field>
      <input class="w-80" hlmInput type="email" placeholder="Email" formControlName="email"/>
      @if (loginForm.get('email')?.invalid) {
        <hlm-error>Tu email no es válido</hlm-error>
      }
      @if (loginForm.get('email')?.errors?.['required']) {
        <hlm-error>Tu email es requerido</hlm-error>
      }
    </hlm-form-field>
    <hlm-form-field>
      <input class="w-80" hlmInput type="password" placeholder="Contraseña" formControlName="password"/>
      @if (loginForm.get('password')?.touched && loginForm.get('password')?.errors?.['required']) {
        <hlm-error>Tu contraseña es requerida</hlm-error>
      }
    </hlm-form-field>
    @if (errorMessage) {
      <hlm-error>{{ errorMessage }}</hlm-error>
    }
    <button hlmBtn type="submit" [disabled]="loginForm.invalid">Login</button>
  </form>
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
