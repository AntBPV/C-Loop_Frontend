import { Component, OnInit, signal, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SvgIcon } from '../svg-icon/svg-icon';
import { CommonModule } from '@angular/common';
import { API_CONFIG } from '../../core/config/api.config';

interface UserInfo {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, SvgIcon, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  menuAbierto = signal(false);
  usuario = signal<UserInfo | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http
      .get<UserInfo>(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.users.me}`, { headers })
      .subscribe({
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-wrapper')) {
      this.menuAbierto.set(false);
    }
  }
}
