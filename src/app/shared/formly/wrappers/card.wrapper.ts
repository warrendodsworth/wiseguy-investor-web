import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'app-formly-wrapper-card',
  template: `
    <mat-card>
      <!-- <mat-card-title>{{ to.label }}</mat-card-title> -->
      <ng-container #fieldComponent></ng-container>
    </mat-card>
  `,
})
export class CardWrapper extends FieldWrapper {}
