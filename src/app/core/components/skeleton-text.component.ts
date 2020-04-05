import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-skeleton-text',
  template: `
    <list-content-loader *ngIf="view == 'item'"></list-content-loader>
    <facebook-content-loader *ngIf="view == 'fb'"></facebook-content-loader>
  `,
  styles: [``],
})
export class SkeletonTextComponent implements OnInit {
  constructor() {}

  @Input() view = 'item';

  ngOnInit() {}
}
