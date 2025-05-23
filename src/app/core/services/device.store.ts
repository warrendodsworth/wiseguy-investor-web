import { Injectable } from '@angular/core';

import { AppConfig } from '../app-config';
import { State, Store } from '../store';

class DeviceState extends State {
  id: string;
  hasLoggedIn?: boolean;
}

/**
 * device store to define which app this device is running - so it knows on reload
 */
@Injectable({ providedIn: 'root' })
export class DeviceStore extends Store<DeviceState> {
  constructor(appDefaults: AppConfig) {
    super({ id: appDefaults.id, version: appDefaults.version }, '@appId');
  }

  getDefaultUrl() {
    return '/app/tabs/accounts';
  }
}
