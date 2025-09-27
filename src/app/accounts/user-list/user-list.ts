import { Component, OnInit } from '@angular/core';
import { QueryConstraint, where } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject, from, shareReplay, switchMap, takeUntil } from 'rxjs';
import { AppUser } from '../../core/models/user';
import { AuthService } from '../../core/services/auth.service';
import { QueryConfig } from '../../core/services/base-firestore-entity.service';
import { UserService } from '../../core/services/user.service';
import { UtilService } from '../../core/services/util.service';
import { SharedModule } from '../../shared/shared.module';
import { UserItemComponent } from '../components/user-item.component';
import { UserListPageStore } from './user-list-filter.component';

@Component({
  templateUrl: './user-list.html',
  imports: [SharedModule, UserItemComponent],
})
export class UserList implements OnInit {
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public auth: AuthService,
    public util: UtilService,
    public _user: UserService,
    public _store: UserListPageStore
  ) {}
  private destroy$ = new Subject();

  usersSub = new BehaviorSubject<AppUser[] | null>([]);
  get users$() {
    return this.usersSub.asObservable().pipe(shareReplay(1));
  }
  query = { path: 'users', orderByField: 'uid', limit: 20, reverse: false, prepend: false } as QueryConfig;
  constraints: QueryConstraint[] = [];

  async ngOnInit() {
    this._store.state$
      .pipe(
        switchMap((state) => {
          // Build up the query using AngularFire modular API
          if (state.role) {
            this.constraints.push(where('roles.' + state.role, '==', true));
          }
          if (state.role === 'mate' && (state.mateActive === true || state.mateActive === false)) {
            this.constraints.push(where('mateActive', '==', state.mateActive));
          }
          if (state.role === 'user' && state.joinStatus) {
            this.constraints.push(where('mateJoin.' + state.joinStatus, '==', true));
          }

          return from(this._user.firstPage(this.query, 2, ...this.constraints));
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((users) => {
        this.usersSub.next(users as AppUser[]);
      });
  }

  async logScrolling(e: any, users: AppUser[]) {
    this.usersSub.next((await this._user.nextPage(users, this.query, 2, ...this.constraints)) as AppUser[]);
    e.target.complete();
  }

  async doRefresh(event: any) {
    this.usersSub.next((await this._user.firstPage(this.query, 2, ...this.constraints)) as AppUser[]);
    event.target.complete();
  }

  async openFilterPopover(event: Event) {
    // const p = await this.popoverController.create({ component: UserListFilterComponent, event });
    // p.present();
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
