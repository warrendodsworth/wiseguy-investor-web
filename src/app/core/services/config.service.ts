import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { first, shareReplay, switchMap, tap } from 'rxjs/operators';

import { AppConfig, UserPrefs } from '../app-config';
import { Store } from '../store';
import { DeviceStore } from './device.store';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  constructor(private title: Title, public afAuth: AngularFireAuth, public afs: AngularFirestore, public _device: DeviceStore) {
    this.app$ = this._device.state$.pipe(
      switchMap((a) =>
        this.afs
          .doc<AppConfig>(`apps/${a.id}`)
          .valueChanges({ idField: 'id' })
          .pipe(
            // tap(app => {
            // console.log('app:config: app', app.id);
            // }),
            tap((app) => this.title.setTitle(app.title)),
            shareReplay(1)
          )
      ),
      shareReplay(1)
    );
  }

  /**
   * Current app
   */
  readonly app$: Observable<AppConfig>;
  getApp() {
    return this.app$.pipe(first()).toPromise();
  }

  /**
   * for local dev device to switch app configurations
   * @param id appId
   */
  switchApp(id: string) {
    this._device.dispatch({ ...this._device.state, id });
  }
}

/**
 * User Preferences - locally stored
 */
@Injectable({ providedIn: 'root' })
export class PrefStore extends Store<UserPrefs> {
  constructor(prefDefaults: UserPrefs) {
    super(prefDefaults, '@prefs');
  }

  setPrefs(next: Partial<UserPrefs>) {
    this.dispatch(next);
  }
}
