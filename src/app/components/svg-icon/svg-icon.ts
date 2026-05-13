import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-svg-icon',
  standalone: true,
  template: `<span class="svg-icon" [style.color]="color"></span>`,
  styles: [`
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }
    .svg-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }
    .svg-icon ::ng-deep svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
    }
  `]
})
export class SvgIcon implements OnInit {
  @Input() src = '';
  @Input() color = 'currentColor';

  constructor(private http: HttpClient, private el: ElementRef) {}

  ngOnInit() {
    this.http.get(this.src, { responseType: 'text' }).subscribe({
      next: (svg) => {
        const cleaned = svg
          .replace(/width="[^"]*"/, 'width="100%"')
          .replace(/height="[^"]*"/, 'height="100%"')
          .replace(/<\?xml[^>]*\?>/, '');
        const span = this.el.nativeElement.querySelector('.svg-icon');
        if (span) span.innerHTML = cleaned;
      },
      error: (err) => console.log('Error:', err)
    });
  }
}