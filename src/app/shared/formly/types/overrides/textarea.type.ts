import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'app-formly-field-mat-textarea',
  template: `
    <mat-form-field appearance="fill">
      <textarea
        matInput
        [formControl]="$any(formControl)"
        [formlyAttributes]="field"
        [cols]="to.cols"
        [rows]="to.rows"
        [placeholder]="to.placeholder"
        [cdkTextareaAutosize]="to.autoGrow ?? true"
        cdkAutosizeMinRows="1"
        cdkAutosizeMaxRows="5"
      >
      </textarea>
    </mat-form-field>
  `,
  styles: [':host { display: inherit; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatTextAreaType extends FieldType {}
