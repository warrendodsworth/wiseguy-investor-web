import { Component, OnInit } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-list-header-type',
  template: `
    <mat-toolbar class="mat-elevation-z0" [ngClass]="{ 'mat-primary': to.mode === 'primary' }">
      <h1 *ngIf="to.case == 'title'" class="mat-h1">{{ to.label | titlecase }}</h1>
      <h1 *ngIf="to.case == 'upper'" class="mat-h1">{{ to.label | uppercase }}</h1>
      <h1 *ngIf="!to.case || to.case == 'normal'" class="mat-h1">{{ to.label }}</h1>
    </mat-toolbar>
  `,
  styles: [
    `
      .mat-h1 {
        font-size: 1.25rem;
      }
    `,
  ],
})
export class ListHeaderType extends FieldType implements OnInit {
  defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      case: 'title',
    },
  };
  ngOnInit(): void {}
}
