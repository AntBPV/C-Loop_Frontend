import { Component, Input, OnInit, OnChanges, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-svg-icon',
  standalone: true,
  template: `<span class="svg-icon"></span>`,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: inherit;
      }
      .svg-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .svg-icon ::ng-deep svg {
        fill: currentColor;
        width: 1em;
        height: 1em;
        overflow: visible;
        display: block;
      }
    `,
  ],
})
export class SvgIcon implements OnInit, OnChanges {
  @Input() src = '1em';
  @Input() color = 'currentColor';
  @Input() size = '24px';

  constructor(
    private http: HttpClient,
    private el: ElementRef,
  ) {}

  ngOnInit() {
    this.loadSvg();
  }

  ngOnChanges() {
    this.loadSvg();
  }

  private loadSvg() {
    if (!this.src) return;
    this.http.get(this.src, { responseType: 'text' }).subscribe({
      next: (svg) => {
        const cleaned = svg
          .replace(/<\?xml[^>]*\?>/, '')
          .replace(/width="[^"]*"/g, '')
          .replace(/height="[^"]*"/g, '');
        const span = this.el.nativeElement.querySelector('.svg-icon');
        if (span) {
          span.innerHTML = cleaned;
          span.style.color = this.color;
        }
      },
      error: (err) => console.log('SvgIcon error:', err),
    });
  }
}
