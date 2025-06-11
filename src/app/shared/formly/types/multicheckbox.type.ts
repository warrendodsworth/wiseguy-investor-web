import { Component, OnInit, QueryList, ViewChildren, input } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { MatListOption } from '@angular/material/list';
import { Observable, from, of } from 'rxjs';

@Component({
  selector: 'app-formly-field-mat-multicheckbox',
  template: `
    <label *ngIf="to.label" class="mat-form-field-label">{{ to.label }}</label>

    <mat-selection-list #selList [ngModel]="selectedList" (selectionChange)="onModelChange($event)" [multiple]="true">
      <mat-list-option
        *ngFor="let option of options1 | async; let i = index"
        [value]="option.value"
        [disabled]="formControl.disabled"
        [checkboxPosition]="to.checkboxPosition || 'after'"
        (selectionChange)="onChange(option.value || option.label, $event.checked)"
      >
        {{ option.label }}
      </mat-list-option>

      <!--  formlySelectOptions : field -->
    </mat-selection-list>
  `,
})
export class MultiCheckboxType extends FieldType implements OnInit {
  defaultOptions = {
    templateOptions: {
      options: [],
      color: '',
    },
  };

  selectedList = [];

  public get options1() {
    return this.to.options instanceof Observable ? this.to.options : of(this.to.options);
  }

  @ViewChildren(MatListOption) checkboxes!: QueryList<MatListOption>;

  ngOnInit() {}

  onModelChange(event: any) {
    this.selectedList = event.selectedOptions.selected.map((o) => o.value);
  }

  onChange(value: any, checked: boolean) {
    if (this.to.type === 'array') {
      // array
      this.formControl.patchValue(
        checked ? [...(this.formControl.value || []), value] : [...(this.formControl.value || [])].filter((o) => o !== value)
      );
    } else {
      // object
      this.formControl.patchValue({ ...this.formControl.value, [value]: checked });
    }

    this.formControl.markAsTouched();
  }

  isCheckedInModel(option: any) {
    const model = this.formControl.value;

    return (
      model &&
      (this.to.type === 'array' ? model.indexOf(option.value || option.label) !== -1 : model[option.value || option.label])
    );
  }
}
