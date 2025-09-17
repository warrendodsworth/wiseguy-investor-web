import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-avatar-picker',
  imports: [CommonModule, MatDialogModule, MatIconModule],
  templateUrl: './avatar-picker.component.html',
})
export class AvatarPickerComponent implements OnInit {
  AVATAR_COUNT = 15;
  avatars: string[] = [];

  constructor(public dialogRef: MatDialogRef<AvatarPickerComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.avatars = [...Array(this.AVATAR_COUNT).keys()].map((x) => `/assets/avatars/avatar${x}.png`);
  }

  selectAvatar(url: string) {
    url = environment.rootUrl + url;
    this.dialogRef.close(url);
  }

  dismiss() {
    this.dialogRef.close();
  }
}
