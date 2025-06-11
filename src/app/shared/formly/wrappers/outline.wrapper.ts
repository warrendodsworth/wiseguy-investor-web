import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'app-formly-wrapper-outline',
  template: `
    <div [class]="field.className || 'border rounded border-light'">
      <!-- <ion-label>{{ to.label }}</ion-label> -->
      <ng-container #fieldComponent></ng-container>
    </div>
  `,
})
export class OutlineWrapper extends FieldWrapper {}
