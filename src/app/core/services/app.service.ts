import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { AppConfig } from '../app-config';
import { EntityBaseFirestoreService } from './base-firestore-entity.service';
import { SetOptions } from './base-firestore.service';
import { DeviceStore } from './device.store';
import { UtilService } from './util.service';

// Service to allow an admin to switch between appConfigs
@Injectable({ providedIn: 'root' })
export class AppService extends EntityBaseFirestoreService<AppConfig> {
  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public util: UtilService,
    public _device: DeviceStore
  ) {
    super(afs, afAuth, util, 'apps');
  }

  _set(id: string, data: Partial<AppConfig>, options?: Partial<SetOptions>) {
    const app = { ...new AppConfig(), ...data };
    if (!app.id) {
      console.log('[app] id not provided');
      return null;
    }

    return super._set(id, data, options);
  }
}
