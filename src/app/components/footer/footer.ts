import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollService } from '../../core/services/scroll';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  constructor(private scrollService: ScrollService) {}

  scrollTo(sectionId: string) {
    this.scrollService.scrollTo(sectionId);
  }

  institutionUrl = 'https://www.ucc.edu.co';
  currentYear = new Date().getFullYear();
}
