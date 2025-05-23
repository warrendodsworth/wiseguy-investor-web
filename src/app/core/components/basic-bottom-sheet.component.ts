import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MaterialModule } from '../material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-basic-bottom-sheet',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <mat-nav-list>
      <a href="#" *ngFor="let item of data" (click)="openLink(item)" mat-list-item>
        {{ item.name }}
      </a>
    </mat-nav-list>
  `,
})
export class BasicBottomSheetComponent {
  constructor(
    private bottomSheetRef: MatBottomSheetRef<BasicBottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any[]
  ) {}

  openLink(item: any): void {
    // Handle the click event on an item
    this.bottomSheetRef.dismiss();
    console.log(item);
  }
}
