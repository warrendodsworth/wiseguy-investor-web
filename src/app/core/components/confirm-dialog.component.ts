import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../material.module';

interface DialogData {
  title: string;
  message: string;
  body2: string;
  body3: string;
  buttonText: string;
  showClose: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>

    <mat-dialog-content>
      <p *ngIf="data.message">{{ data.message }}</p>
      <p *ngIf="data.body2">{{ data.body2 }}</p>
      <p *ngIf="data.body3">{{ data.body3 }}</p>
    </mat-dialog-content>

    <mat-dialog-actions fxLayout="row" fxLayoutAlign="center center" fxLayoutGap="8px">
      <button *ngIf="data.showClose" mat-button [mat-dialog-close]="false" tabindex="-1">Cancel</button>
      <button *ngIf="data.buttonText" mat-flat-button color="primary" (click)="confirm()">{{ data.buttonText }}</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, public dialogRef: MatDialogRef<ConfirmDialogComponent>) {}

  ngOnInit() {}

  confirm() {
    this.dialogRef.close(true);
  }
}
