import { Component, OnInit, signal, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService, CurrentUser } from '../../core/services/auth-service';
import { SvgIcon } from '../svg-icon/svg-icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, SvgIcon, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  menuAbierto = signal(false);
  usuario = signal<CurrentUser | null>(null);

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    const storedUser = this.authService.getStoredUser();

    if (storedUser) {
      this.usuario.set(storedUser);
      return;
    }

    this.authService.getCurrentUser().subscribe({
      next: (data) => this.usuario.set(data),
      error: () => {},
    });
  }

  toggleMenu() {
    this.menuAbierto.set(!this.menuAbierto());
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  canAccessStaffFeatures(): boolean {
    return this.authService.hasAnyRole(['ADMIN', 'GESTOR_PROYECCION', 'REVISOR_JURIDICO']);
  }

  canAccessCompanyValidation(): boolean {
    return this.authService.hasAnyRole(['ADMIN', 'REVISOR_JURIDICO']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-wrapper')) {
      this.menuAbierto.set(false);
    }
  }
}
