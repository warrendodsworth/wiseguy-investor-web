import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-formly-field-stepper',
  template: `
    <!-- to allow index 0 which is a falsy value -->
    <ng-container *ngIf="{ selectedIndex: selectedIndex$ | async } as data">
      <ng-container *ngIf="data !== null || data !== undefined">
        <ng-container *ngFor="let step of field.fieldGroup; let index = index; let last = last">
          <ng-container *ngIf="data.selectedIndex == index">
            <!-- {{ step.templateOptions.label }} -->
            <div class="text-center py-2" *ngIf="field.fieldGroup.length > 1">
              <label class="font-weight-bold"> Step {{ index + 1 }}/{{ field.fieldGroup.length }}</label>
            </div>

            <formly-field [field]="step"></formly-field>

            <div class="flex items-center justify-start gap-4 pt-4">
              <button
                mat-button
                (click)="selectionChange(data.selectedIndex - 1)"
                *ngIf="index !== 0"
                color="medium"
                fill="clear"
                type="button"
              >
                <mat-icon *ngIf="to.showIcons">arrow_back</mat-icon>
                <ng-container *ngIf="to.showButtons"> Back </ng-container>
              </button>

              <button
                mat-button
                (click)="selectionChange(data.selectedIndex + 1)"
                *ngIf="!last"
                shape="round"
                type="button"
                [color]="isValid(step) ? 'primary' : 'primary'"
                [disabled]="!isValid(step)"
              >
                <mat-icon *ngIf="to.showIcons">arrow_forward</mat-icon>
                <ng-container *ngIf="to.showButtons"> {{ to.nextButtonText || 'Next' }} </ng-container>
              </button>
              <!-- [fill]="isValid(step) ? 'solid' : 'outline'" -->

              <button mat-button *ngIf="last" [disabled]="form.invalid" type="submit">
                {{ to.buttonText || 'Finish' }}
              </button>
            </div>
          </ng-container>
        </ng-container>
      </ng-container>
    </ng-container>
  `,
})
export class StepperType extends FieldType implements OnInit {
  constructor(public route: ActivatedRoute, public router: Router) {
    super();
  }
  defaultOptions = {
    templateOptions: {
      showButtons: true,
    },
  };

  selectedIndex$: Observable<number>;
  get stepperIndexKey() {
    return (this.field.name || '') + 'StepperIndex';
  }

  ngOnInit(): void {
    // to change step from parent page
    this.selectedIndex$ = this.route.queryParamMap.pipe(
      map((p) => (p.has(this.stepperIndexKey) ? +p.get(this.stepperIndexKey) || 0 : 0))
    );
  }

  selectionChange(newIndex: number) {
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: { [this.stepperIndexKey]: newIndex },
      queryParamsHandling: 'merge',
    });
  }

  isValid(field: FormlyFieldConfig): boolean {
    if (field.key) {
      if (field.templateOptions.disabled || field.hide) return true;

      return field.formControl.valid;
    }

    return field.fieldGroup ? field.fieldGroup.every((f) => this.isValid(f)) : true;
  }
}
