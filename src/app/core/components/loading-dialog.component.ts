import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-dialog',
  standalone: true,
  imports: [MatDialogModule, MatProgressSpinnerModule], // Import required modules here
  template: `
    <div class="loading-dialog-content">
      <mat-spinner></mat-spinner>
      <p>{{ data.message }}</p>
    </div>
  `,
  styles: [
    `
      .loading-dialog-content {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }
      p {
        margin-top: 20px;
        text-align: center;
      }
    `,
  ],
})
export class LoadingDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
}
