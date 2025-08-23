import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AppUser } from '../../core/models/user';
import { AuthService } from '../../core/services/auth.service';
import { UtilService } from '../../core/services/util.service';
import { UserService } from '../../core/services/user.service';
import { SharedModule } from '../../shared/shared.module';
import { MatDialog } from '@angular/material/dialog';
import { UsersAdminPopoverComponent } from './user-admin-popover.component';

@Component({
  selector: 'app-user-item',
  standalone: true,
  imports: [SharedModule],
  template: `
    <div *ngIf="user" class="flex items-center px-4 py-3 hover:bg-gray-50 transition group">
      <div class="flex-shrink-0 cursor-pointer" (click)="handleClick(user)">
        @if (!user?.photoURL) {
        <!-- <span class="material-symbols-rounded text-gray-400 text-4xl">person</span> -->
        <div class="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full text-gray-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        } @else {
        <app-show-photo
          [url]="user.photoURLThumb || user.photoURL"
          cssClass="w-10 h-10 rounded-full object-cover"
        ></app-show-photo>
        }
      </div>

      <div class="flex-1 min-w-0 ml-4">
        <div class="flex items-center justify-between w-full">
          <div>
            <div class="font-medium text-gray-900 cursor-pointer" (click)="handleClick(user)">
              {{ showFullName ? user.displayName : util.firstName(user.displayName) }}
              <span *ngIf="adminView" class="text-xs text-gray-500 ml-2">{{ util.toKeys(user?.roles) }}</span>
            </div>

            @if (adminView) {
            <div class="text-xs text-gray-500 mt-1">
              <span *ngIf="user.lastActiveDate">
                <ng-container *ngIf="user.lastActiveDate">active {{ $any(user.lastActiveDate) | fromNow }}</ng-container>
              </span>
            </div>

            <div class="flex flex-wrap gap-2 mt-1">
              <!-- Extended admin view -->
            </div>
            }
          </div>

          <!-- Buttons -->
          <div class="flex items-center gap-2 text-gray-500 text-xs ml-4">
            <button
              *ngIf="adminView && !selectMode"
              [routerLink]="['/accounts/users', user?.uid, 'edit']"
              class="p-2 rounded-full hover:bg-gray-200 text-primary-600"
            >
              <span class="material-symbols-rounded">edit</span>
            </button>

            <ng-container *ngIf="auth.currentUser$ | async as currentUser">
              <button
                *ngIf="adminView && !selectMode"
                (click)="morePopover($event, user, currentUser)"
                class="p-2 rounded-full hover:bg-gray-200 text-accent-600"
              >
                <span class="material-symbols-rounded">more_vert</span>
              </button>
            </ng-container>
          </div>
        </div>
      </div>
    </div>

    <!-- Extended admin view -->
    <!-- <span *ngIf="user.roles?.mate" class="text-green-600 font-semibold"
            >mate
            <span *ngIf="user.mateActive" class="text-blue-500 ml-1">active</span>
            <span *ngIf="!user.mateActive" class="text-yellow-600 ml-1">inactive</span>
          </span>
          <ng-container *ngFor="let key of user.mateJoin | keys">
            <a
              *ngIf="user.mateJoin[key]"
              [routerLink]="['../', user.uid, 'settings', 'mate-join']"
              class="flex items-center gap-1 px-2 py-1 rounded bg-gray-100 text-xs text-gray-700 hover:bg-gray-200"
            >
              <span
                class="material-symbols-rounded text-base"
                [ngClass]="key == 'verificationIssue' ? 'text-red-500' : 'text-green-600'"
              >
                {{ key == 'verificationIssue' ? 'cancel' : 'check_circle' }}
              </span>
              <span>{{ key | humanize }}</span>
            </a>
          </ng-container> -->
  `,
})
export class UserItemComponent implements OnInit {
  constructor(
    public router: Router,
    public auth: AuthService,
    public util: UtilService,
    public _user: UserService,
    private dialog: MatDialog
  ) {}

  @Input() uid: string;
  @Input() user: AppUser;
  @Input() adminView = false;
  @Input() showFullName = false;

  // Select or view user
  // Show edit controls or use Search and pick functionality which returns a user object
  @Input() selectMode = false;
  @Output() onSelectEvent = new EventEmitter<AppUser>();

  async ngOnInit() {
    if (!this.user && this.uid) {
      this.user = await this.auth.getUser(this.uid);
    }
  }

  morePopover(event: any, user: AppUser, currentUser: AppUser) {
    this.dialog.open(UsersAdminPopoverComponent, {
      data: {
        user,
        currentUser,
      },
    });
  }

  handleClick(user: AppUser) {
    if (this.selectMode) {
      this.onSelectEvent.emit(user);
    } else {
      this.router.navigate(['/accounts/users', user.uid]);
    }
  }
}
