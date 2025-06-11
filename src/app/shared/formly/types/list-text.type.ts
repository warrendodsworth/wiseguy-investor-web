import { Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'app-list-text-type',
  template: `
    <mat-list-item *ngIf="to?.label">
      <div [ngClass]="field.className" class="mat-typography">
        <span [ngStyle]="{ color: to.color || 'black' }">{{ to.label }}</span>
      </div>
    </mat-list-item>
  `,
  styles: [
    `
      .mat-list-item {
        border-bottom: 1px solid #e0e0e0; /* Optional: if you want to mimic ion-item border */
        padding: 0; /* Adjust padding as needed */
      }
    `,
  ],
})
export class ListTextType extends FieldType implements OnInit {
  ngOnInit(): void {}
}
