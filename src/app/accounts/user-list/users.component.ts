import { Component, OnInit } from '@angular/core';
import { Query, QueryFn } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject, from, shareReplay, switchMap, takeUntil } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { AppUser } from '../../core/models/user';
import { QueryConfig } from '../../core/services/base-firestore-entity.service';
import { UserService } from '../../core/services/user.service';
import { UtilService } from '../../core/services/util.service';
import { UserListPageStore } from './user-list-filter.component';
import { SharedModule } from '../../shared/shared.module';
import { UserItemComponent } from '../components/user-item.component';

@Component({
  templateUrl: './users.component.html',
  standalone: true,
  imports: [SharedModule, UserItemComponent], // Add necessary imports here
})
export class UsersComponent implements OnInit {
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public auth: AuthService,
    public util: UtilService,
    public _user: UserService,
    public _store: UserListPageStore
  ) {}
  private destroy$ = new Subject();

  usersSub = new BehaviorSubject<AppUser[]>([]);
  get users$() {
    return this.usersSub.asObservable().pipe(shareReplay(1));
  }

  query = { path: 'users', orderByField: 'uid', limit: 20, reverse: false, prepend: false } as QueryConfig;
  qf: QueryFn;

  async ngOnInit() {
    this._store.state$
      .pipe(
        switchMap((state) => {
          this.qf = (q: Query) => {
            if (state.role) {
              q = q.where('roles.' + state.role, '==', true);
            }
            if (state.role == 'mate' && (state.mateActive === true || state.mateActive === false)) {
              q = q.where('mateActive', '==', state.mateActive);
            }
            if (state.role == 'user' && state.joinStatus) {
              q = q.where('mateJoin.' + state.joinStatus, '==', true);
            }
            return q;
          };

          return from(this._user.firstPage(this.query, 2, this.qf));
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((users) => {
        this.usersSub.next(users);
      });
  }

  async logScrolling(e: any, users: AppUser[]) {
    this.usersSub.next(await this._user.nextPage(users, this.query, 2, this.qf));
    e.target.complete();
  }

  async doRefresh(event: any) {
    this.usersSub.next(await this._user.firstPage(this.query, 2, this.qf));
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
