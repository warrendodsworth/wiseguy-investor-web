import { Component, ChangeDetectionStrategy, input, output, signal, inject, model } from '@angular/core';
import { Router } from '@angular/router';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (user() != null) {
    <div class="flex items-center px-4 py-3 hover:bg-gray-50 transition group">
      <div class="flex-shrink-0 cursor-pointer" (click)="handleClick(user()!)">
        @if (!user()!.photoURL) {
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
          [url]="user()!.photoURLThumb || user()!.photoURL"
          cssClass="w-10 h-10 rounded-full object-cover"
        ></app-show-photo>
        }
      </div>

      <div class="flex-1 min-w-0 ml-4">
        <div class="flex items-center justify-between w-full">
          <div>
            <div class="font-medium text-gray-900 cursor-pointer" (click)="handleClick(user()!)">
              {{ showFullName() ? user()!.displayName : util.firstName(user()!.displayName) }}
              @if (adminView()) {
              <span class="text-xs text-gray-500 ml-2">{{ util.toKeys(user()!.roles) }}</span>
              }
            </div>

            @if (adminView()) {
            <div class="text-xs text-gray-500 mt-1">
              @if (user()!.lastActiveDate) {
              <ng-container>active {{ $any(user()!.lastActiveDate) | fromNow }}</ng-container>
              }
            </div>
            <div class="flex flex-wrap gap-2 mt-1">
              <!-- Extended admin view -->
            </div>
            }
          </div>

          <div class="flex items-center gap-2 text-gray-500 text-xs ml-4">
            @if (adminView() && !selectMode()) {
            <button
              [routerLink]="['/accounts/users', user()!.uid, 'edit']"
              class="p-2 rounded-full hover:bg-gray-200 text-primary-600"
            >
              <span class="material-symbols-rounded">edit</span>
            </button>
            <ng-container *ngIf="auth.currentUser$ | async as currentUser">
              <button
                (click)="morePopover($event, user()!, currentUser)"
                class="p-2 rounded-full hover:bg-gray-200 text-accent-600"
              >
                <span class="material-symbols-rounded">more_vert</span>
              </button>
            </ng-container>
            }
          </div>
        </div>
      </div>
    </div>
    }
  `,
})
export class UserItemComponent {
  router = inject(Router);
  auth = inject(AuthService);
  util = inject(UtilService);
  dialog = inject(MatDialog);
  _user = inject(UserService);

  uid = input<string>('');
  user = model<AppUser | null>(null);

  adminView = input<boolean>(false);
  showFullName = input<boolean>(false);
  selectMode = input<boolean>(false);
  onSelectEvent = output<AppUser | null>();

  constructor() {
    this.initUser();
  }

  private async initUser() {
    if (!this.user() && this.uid()) {
      const fetchedUser = await this.auth.getUser(this.uid());
      this.user.set(fetchedUser);
    }
  }

  morePopover(event: unknown, user: AppUser | null, currentUser: AppUser) {
    this.dialog.open(UsersAdminPopoverComponent, {
      data: {
        user,
        currentUser,
      },
    });
  }

  handleClick(user: AppUser | null) {
    if (this.selectMode()) {
      this.onSelectEvent.emit(user);
    } else {
      this.router.navigate(['/accounts/users', user?.uid]);
    }
  }
}
