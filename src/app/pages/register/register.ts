import { CommonModule } from '@angular/common';
import { Component,signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  email = '';
  codeSent = signal(false);
  isRequestingCode = signal(false);
  fullName = '';
  password = '';
  code = '';
  isRegistering = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  requestCode() {
    if (!this.email) return;
    this.isRequestingCode.set(true);
    this.error.set(null);
    this.success.set(null);

    this.authService.requestCode({ email: this.email }).subscribe({
      next: (response) => {
        console.log('Respuesta exitosa:', response);
        this.isRequestingCode.set(false);
        this.codeSent.set(true);
        this.success.set(`Código enviado a ${this.email}`);
      },
      error: (err) => {
        console.log('Status:', err.status);
        console.log('Error completo:', err);
        console.log('Mensaje:', err.error);
        this.isRequestingCode.set(false);
        this.error.set('No se pudo enviar el código. Verifica el correo proporcionado.');
      },
    });
  }

  onSubmit() {
    if (!this.fullName || !this.password || !this.code) return;
    this.isRegistering.set(true);
    this.error.set(null);

    this.authService
      .register({
        fullName: this.fullName,
        email: this.email,
        password: this.password,
        code: this.code,
      })
      .subscribe({
        next: () => {
          this.isRegistering.set(false);
          this.router.navigate(['/login']);
        },
        error: () => {
          this.isRegistering.set(false);
          this.error.set('El código es incorrecto o ha expirado. Intenta nuevamente.');
        },
      });
  }
}
