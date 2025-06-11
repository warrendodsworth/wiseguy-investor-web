import { Component, Input, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'app-star-rating',
  template: `
    <div class="star-rating">
      <mat-icon
        *ngFor="let index of iconsArray; let i = index"
        [ngStyle]="{ color: i < rating ? activeColor : defaultColor }"
        (click)="changeRating(i + 1)"
      >
        {{ getIconName(i) }}
      </mat-icon>
    </div>
  `,
  styles: [
    `
      .star-rating {
        display: flex;
        align-items: center;
      }
      mat-icon {
        cursor: pointer;
      }
    `,
  ],
})
export class RateStarsType extends FieldType implements OnInit {
  @Input() rating: number = 0;
  @Input() iconsCount: number = 5;
  @Input() activeColor: string = 'gold';
  @Input() defaultColor: string = 'grey';
  @Input() activeIcon: string = 'star';
  @Input() defaultIcon: string = 'star_border';
  @Input() halfIcon: string = 'star_half';
  @Input() halfStar: boolean = true;

  iconsArray: number[] = [];

  ngOnInit() {
    this.iconsArray = Array.from({ length: this.iconsCount }, (_, index) => index);

    this.rating = this.model[this.field.key as string];
  }

  changeRating(index: number) {
    if (this.to.readonly) {
      return;
    }

    if (this.to.halfStar) {
      this.rating = this.rating - index > 0 && this.rating - index <= 0.5 ? index + 1 : index + 0.5;
      this.form.controls[this.field.key as string].patchValue(this.rating);
    } else {
      this.rating = index + 1;
      this.form.controls[this.field.key as string].patchValue(index + 1);
    }
  }

  getIconName(index: number): string {
    if (this.halfStar && this.rating - index > 0 && this.rating - index <= 0.5) {
      return this.halfIcon;
    } else if (index < this.rating) {
      return this.activeIcon;
    } else {
      return this.defaultIcon;
    }
  }
}
