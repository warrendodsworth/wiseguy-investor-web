import { Component, Inject, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-formly-field-mat-datetime',
  template: ` <button mat-button (click)="openDialog()">{{ to.label }}</button> `,
})
export class MatDatetimeType extends FieldType implements OnInit {
  constructor(public dialog: MatDialog) {
    super();
  }

  ngOnInit() {}

  openDialog(): void {
    const dialogRef = this.dialog.open(MatDatetimeDialog, {
      width: '250px',
      data: { formControl: this.formControl, field: this.field },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.formControl.setValue(result);
    });
  }

  private _displayDate: string;
  public get displayDate(): string {
    const date = this._displayDate || this.formControl.value;

    return date ? DateTime.fromISO(date).toLocaleString({ day: 'numeric', month: 'short', year: 'numeric' }) : '';
  }
  public set displayDate(value: string) {
    this._displayDate = value;
  }

  setDate(value: string | string[]) {
    if (!Array.isArray(value)) {
      this.displayDate = value;
    } else {
      this.displayDate = value.join(', ');
    }
  }
}

@Component({
  selector: 'mat-datetime-dialog',
  template: `
    <h1 mat-dialog-title>{{ data.field.templateOptions.label }}</h1>
    <div mat-dialog-content>
      <mat-form-field appearance="fill">
        <mat-label>Choose a date</mat-label>
        <input matInput [matDatepicker]="picker" [formControl]="data.formControl" />
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
      </mat-form-field>
      <!-- Add your time picker here -->
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button mat-button [mat-dialog-close]="data.formControl.value" cdkFocusInitial>Ok</button>
    </div>
  `,
})
export class MatDatetimeDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<MatDatetimeDialog>) {}

  onNoClick(): void {
    this.dialogRef.close({ date: this.data.formControl.value });
  }
}
