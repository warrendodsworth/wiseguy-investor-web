import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MaterialModule } from '../material.module';

@Component({
  selector: 'app-empty-list',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <mat-card *ngIf="list && list.length == 0" class="ion-padding-top">
      <mat-card-content class="flex-col justify-start items-center gap-y-4">
        <div><mat-icon color="medium">pulse</mat-icon></div>
        <p>{{ msg }}</p>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .ion-padding-top {
        padding-top: 20px;
      }
    `,
  ],
})
export class EmptyListComponent implements OnInit {
  @Input() list: any[];
  @Input() msg?: string = `Sorry, there's nothing here right now`;

  ngOnInit() {}
}
