import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface MenuItem {
  label: string,
  description: string,
  icon: string,
  fragment?: string
}

interface MenuData {
  [key: string]: MenuItem[];
}

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  isScrolled = signal(false);
  isHovered = signal(false);
  activeMenu = signal<string | null>(null);
  isMenuVisible = signal(false);
  private closeTimeout: any;

  menus: MenuData = {
    explorar: [
      { label: 'Convenios', description: 'Consulta los convenios activos de tu institución.', icon: 'public/icons/convenios.svg' },
      { label: 'Empresas', description: 'Explora las empresas vinculadas al sistema.', icon: 'public/icons/empresas.svg' },
      { label: 'Estadísticas', description: 'Visualiza datos generales del sistema.', icon: 'public/icons/estadisticas.svg' },
    ],
    recursos: [
      { label: 'Guía de uso', description: 'Aprende a usar C-Loop paso a paso.', icon: 'public/icons/guia.svg' },
      { label: 'Preguntas frecuentes', description: 'Resuelve las dudas más comunes.', icon: 'public/icons/faq.svg', fragment: 'faq' },
    ],
    desarrolladores: [
      { label: 'Quienes Somos', description: 'Conoce quien esta detras de C-Loop.', icon: 'public/icons/meet.svg', fragment: 'quienes-somos' },
      { label: 'Documentación', description: 'Accede a la documentación técnica de la API.', icon: 'public/icons/docs.svg' },
      { label: 'Repositorio', description: 'Revisa el código fuente del proyecto.', icon: 'public/icons/repo.svg' },
    ],
  };

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled.set(window.scrollY > 0);
  }

  toggleMenu(menu: string) {
    if (this.activeMenu() === menu) {
      this.closeMenuAnimated();
    } else {
      this.activeMenu.set(menu);
      setTimeout(() => this.isMenuVisible.set(true), 10);
    }
  }

  closeMenuAnimated() {
    this.isMenuVisible.set(false);
    this.closeTimeout = setTimeout(() => this.activeMenu.set(null), 250);
  }
}
