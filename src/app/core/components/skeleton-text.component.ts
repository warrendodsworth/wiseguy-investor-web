import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MaterialModule } from '../material.module';

@Component({
  selector: 'app-skeleton-text',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <!-- <list-content-loader *ngIf="view == 'item'"></list-content-loader>
    <facebook-content-loader *ngIf="view == 'fb'"></facebook-content-loader> -->
  `,
})
export class SkeletonTextComponent implements OnInit {
  constructor() {}

  @Input() view = 'item';

  ngOnInit() {}
}
