import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScrollService {
  scrollTo(sectionId: string, offset: number = 80) {
    const element = document.getElementById(sectionId);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }
}