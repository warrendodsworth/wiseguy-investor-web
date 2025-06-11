import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

import { UtilService } from '../../../core/services/util.service';

@Component({
  selector: 'app-formly-repeat',
  template: `
    <mat-list *ngIf="to.label">
      <h3 mat-subheader class="font-weight-bold">{{ to.label | uppercase }}</h3>
      <button mat-button *ngIf="field.fieldGroup?.length > 0" (click)="add()" type="button">Add {{ to.addText }}</button>
    </mat-list>

    <div *ngFor="let f of field.fieldGroup; let i = index; let last = last; let first = first" [class]="field.className">
      <formly-field class="col" [field]="f"></formly-field>

      <mat-list>
        <mat-list-item>
          <h4 mat-line class="font-weight-bold">{{ to.addText }} {{ i + 1 }}</h4>
          <button mat-icon-button *ngIf="!first" (click)="move('up', i, field.fieldGroup, model)" color="medium">
            <mat-icon>arrow_upward</mat-icon>
          </button>
          <button mat-icon-button *ngIf="!last" (click)="move('down', i, field.fieldGroup, model)" color="medium">
            <mat-icon>arrow_downward</mat-icon>
          </button>
          <button mat-icon-button (click)="confirmRemove(i)" type="button" color="warning">
            <mat-icon>close</mat-icon>
          </button>
        </mat-list-item>
      </mat-list>
    </div>
  `,
})
export class RepeatType extends FieldArrayType {
  constructor(public util: UtilService) {
    super();
  }

  move(dir: 'up' | 'down', previousIndex: number, fieldGroups: any[], model: any[]) {
    const currentIndex = dir == 'up' ? previousIndex - 1 : previousIndex + 1;
    moveItemInArray(fieldGroups, previousIndex, currentIndex);

    // may not need if  try with empty arr
    if (model) {
      moveItemInArray(model, previousIndex, currentIndex);
    }
  }

  async confirmRemove(i: number) {
    if (this.to.noConfirmRemove) {
      this.remove(i);
      return;
    }

    const confirm = await this.util.confirmDialog('Delete', 'Are you sure?', 'Delete');
    if (confirm) {
      this.remove(i);
    }
  }
}
