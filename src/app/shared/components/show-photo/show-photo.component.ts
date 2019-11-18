import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'show-photo',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      [style.backgroundImage]="'url(' + url + ')'"
      class="img-background img-placeholder"
      [ngClass]="cssClass || 'img-yxl'"
    ></div>
  `,
})
export class ShowPhotoComponent implements OnInit {
  @Input() url: string;
  @Input() cssClass?: string;

  ngOnInit() {}
}

// [style.backgroundImage]="util.getSanitizedStyle(photo.url)"
