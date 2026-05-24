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
    const cachedUser = this.authService.getStoredUser();
    if (cachedUser) {
      this.usuario.set(cachedUser);
    }

    this.authService.getCurrentUser().subscribe({
      next: (data) => {
        this.usuario.set(data);
      },
      error: () => {
        this.cerrarSesion();
      },
    });
  }

  toggleMenu() {
    this.menuAbierto.set(!this.menuAbierto());
  }

  cerrarSesion() {
    this.authService.logout(); // Limpia token Y currentUser
    this.router.navigate(['/']);
  }

  canAccessStaffFeatures(): boolean {
    const user = this.usuario();
    if (!user || !user.roles) return false;

    const allowedRoles = ['ADMIN', 'GESTOR_PROYECCION', 'REVISOR_JURIDICO'];
    return user.roles.some((role) => allowedRoles.includes(role));
  }

  canAccessCompanyValidation(): boolean {
    const user = this.usuario();
    if (!user || !user.roles) return false;

    const allowedRoles = ['ADMIN', 'REVISOR_JURIDICO'];
    return user.roles.some((role) => allowedRoles.includes(role));
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-wrapper')) {
      this.menuAbierto.set(false);
    }
  }
}
