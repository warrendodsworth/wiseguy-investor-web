import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';

/**
 * Range slider
 *
 * @bug doesn't work on some iPhone's safari browsers
 */
@Component({
  selector: 'app-formly-field-mat-range',
  template: `
    <mat-form-field appearance="fill">
      <mat-label>
        <ng-container *ngIf="range && range.lower && range.upper; else elseTemplate">
          Between {{ range.lower }} and {{ range.upper }}
        </ng-container>
        <ng-template #elseTemplate>{{ to.label || 'Select range' }}</ng-template>
      </mat-label>
    </mat-form-field>

    <div *ngIf="to.dualKnobs; else singleSlider">
      <mat-slider color="accent" class="range-slider" [min]="to.min" [max]="to.max">
        <input matSliderStartThumb (valueChange)="onRangeChange($event, 'lower')" />
        <input matSliderEndThumb (valueChange)="onRangeChange($event, 'upper')" />
      </mat-slider>
      <!-- <mat-slider
        class="range-slider"
        [formControl]="upperValue"
        [min]="to.min"
        [max]="to.max"
        (change)="onRangeChange()"
        color="accent"
      >
      </mat-slider> -->
    </div>
    <ng-template #singleSlider>
      <mat-slider [formControl]="singleValue" [min]="to.min" [max]="to.max" (change)="onSingleChange()" color="accent">
        <input matSliderThumb />
      </mat-slider>
    </ng-template>
  `,
  styles: [
    `
      .range-slider {
        margin-top: 20px;
      }
    `,
  ],
})
export class FormlyFieldMatRangeComponent extends FieldType implements OnInit {
  range = { lower: null, upper: null };
  singleValue = new FormControl();

  ngOnInit(): void {
    // Initialize form controls if needed
    this.range = this.formControl.value || { lower: null, upper: null };
  }

  onRangeChange(event: any, type: string) {
    if (type === 'lower') {
      this.range.lower = event.value;
    } else {
      this.range.upper = event.value;
    }
  }

  onSingleChange() {
    // Handle single slider change logic here
    this.range.lower = this.singleValue.value;
  }

  change(event: any) {
    const r = event.detail.value;
    if (r.lower) {
      this.formControl.patchValue(r);
    }
  }
}
