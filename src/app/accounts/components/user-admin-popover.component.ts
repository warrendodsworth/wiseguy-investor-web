import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { AppUser } from '../../core/models/user';
import { SHARED_CONFIG } from '../../shared/shared.config';

@Component({
  imports: [SHARED_CONFIG],
  template: `
    <h2 mat-dialog-title class="p-3 flex flex-row justify-between items-center">
      <span class="font-semibold text-base">{{ user.displayName }}</span>
      <a
        [routerLink]="['/accounts/users', user.uid, 'edit']"
        (click)="close()"
        class="text-primary-600 hover:bg-gray-100 rounded p-1"
      >
        <span class="material-symbols-rounded align-middle">edit</span>
      </a>
    </h2>
    <mat-dialog-content class="bg-white rounded-b-2xl px-2 pb-2">
      @if(currentUser.roles.admin) {
      <a
        [routerLink]="['/app/tabs/accounts', user.uid, 'requests']"
        (click)="close()"
        class="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-100"
      >
        <span class="material-symbols-rounded text-base">chat</span>
        <span>Chat requests</span>
      </a>
      <a
        [routerLink]="['/app/tabs/chats']"
        [queryParams]="{ uid: user.uid }"
        (click)="close()"
        class="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-100"
      >
        <span class="material-symbols-rounded text-base">chat_bubble</span>
        <span>Chats</span>
      </a>
      }

      <a
        [routerLink]="['/app/tabs/accounts', user.uid, 'settings', 'mate-join']"
        (click)="close()"
        class="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-100"
      >
        <span class="material-symbols-rounded text-base">person</span>
        <span>Mate in Training status</span>
      </a>

      @if(currentUser.roles.admin) {
      <a
        [routerLink]="['/app/tabs/accounts', user.uid, 'membership']"
        (click)="close()"
        class="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-100"
      >
        <span class="material-symbols-rounded text-base">badge</span>
        <span>User's Groups</span>
      </a>
      <a
        [routerLink]="['/app/tabs/accounts', user.uid, 'issues']"
        (click)="close()"
        class="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-100"
      >
        <span class="material-symbols-rounded text-base">confirmation_number</span>
        <span>Issues reported</span>
      </a>
      <a
        [routerLink]="['/app/tabs/accounts', user.uid, 'feedback']"
        (click)="close()"
        class="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-100"
      >
        <span class="material-symbols-rounded text-base">rate_review</span>
        <span>Feedback received</span>
      </a>
      <a
        [routerLink]="['/app/tabs/accounts', user.uid, 'block-list']"
        (click)="close()"
        class="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-100"
      >
        <span class="material-symbols-rounded text-base">person_remove</span>
        <span>Blocklist</span>
      </a>
      <a
        [routerLink]="['/app/tabs/accounts', user.uid, 'partnerships']"
        (click)="close()"
        class="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-100"
      >
        <span class="material-symbols-rounded text-base">storefront</span>
        <span>Partnerships</span>
      </a>
      }
    </mat-dialog-content>
  `,
})
export class UsersAdminPopoverComponent implements OnInit {
  user: AppUser;
  currentUser: AppUser;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { user: AppUser; currentUser: AppUser },
    public dialogRef: MatDialogRef<UsersAdminPopoverComponent>
  ) {
    this.user = data.user;
    this.currentUser = data.currentUser;
  }

  ngOnInit() {}

  close(action: string = 'close') {
    this.dialogRef.close(action);
  }
}
