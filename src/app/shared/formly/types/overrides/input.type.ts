import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-mat-input',
  template: `
    <mat-form-field>
      <mat-label>{{ props.label }}</mat-label>
      <!-- uses google material symbols imported in index.html -->
      <span matPrefix class="material-symbols-rounded w-10 text-center" *ngIf="props.icon">{{ props.icon }}</span>
      <input
        *ngIf="type !== 'number'; else numberTmp"
        matInput
        [id]="id"
        [name]="field.name"
        [type]="type || 'text'"
        [readonly]="props.readonly"
        [required]="props.required"
        [formControl]="$any(formControl)"
        [formlyAttributes]="field"
        [tabIndex]="props.tabindex"
        [placeholder]="props.placeholder"
      />
      <ng-template #numberTmp>
        <input
          matInput
          [id]="id"
          [name]="field.name"
          type="number"
          [readonly]="props.readonly"
          [required]="props.required"
          [formControl]="formControl"
          [formlyAttributes]="field"
          [tabIndex]="props.tabindex"
          [placeholder]="props.placeholder"
        />
      </ng-template>
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [':host { display: inherit; }'],
})
export class MatInputType extends FieldType<FieldTypeConfig> {
  get type() {
    return this.props.type || 'text';
  }
}

// old one replaced with customized one from formly to add icons etc.
// not sure where errorstatematcher is coming from
// https://github.com/ngx-formly/ngx-formly/blob/main/src/ui/material/input/src/input.type.ts
