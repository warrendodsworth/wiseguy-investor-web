import { Platform } from '@angular/cdk/platform';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Share } from '@capacitor/share';

import packageJson from '../../../../package.json';
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoadingDialogComponent } from '../components/loading-dialog.component';
import { ConfirmDialogComponent } from '../components/confirm-dialog.component';
import { ActionDialogComponent } from '../components/dialog.component';

@Injectable({ providedIn: 'root' })
export class UtilService {
  constructor(
    public sanitizer: DomSanitizer,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,

    public platform: Platform
  ) {}

  // make env accessible thru util without extra import & in templates
  readonly env = environment;
  readonly version = packageJson.version;

  /**
   * Share
   */
  async socialShare(title: string, body: string, url: string, photoURL?: string, dialogTitle = 'Share with your friends') {
    try {
      await Share.share({ title, text: body, url, dialogTitle });
    } catch (error) {
      console.log(`[util] social share:`, error);
    }
  }

  /**
   * FRAMEWORK HELPERS
   */

  async confirmDialog(title?: string, body?: string, buttonText = 'Ok'): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { title: title || 'Delete', message: body || 'Are you sure?', buttonText },
      disableClose: true, // Prevents closing the dialog by clicking outside of it
    });

    return await dialogRef.afterClosed().toPromise();
  }

  async openDialog(component: any, data?: any) {
    const dialogRef = this.dialog.open(component, {
      width: '250px',
      data: data,
    });

    return dialogRef;
  }

  openSnackbar(message: string, action: string = 'OK', duration: number = 2500) {
    const snackbarRef = this.snackBar.open(message, action, { duration });
    return snackbarRef;
  }

  openLoading(message?: string) {
    const dialogRef = this.dialog.open(LoadingDialogComponent, {
      data: { message: message }, // Pass any message to the loading dialog component
      disableClose: true, // Prevent closing by clicking outside or pressing escape
    });
    return dialogRef; // Return the dialogRef so it can be closed from the caller
  }

  hideLoading(dialogRef: MatDialogRef<LoadingDialogComponent>) {
    dialogRef.close();
  }

  /**
   * HELPERS
   */

  firstName(displayName: string) {
    return displayName?.split(' ')[0] || '';
  }
  initials(displayName: string) {
    return displayName
      ?.split(' ')
      .map((n) => n[0])
      .join('');
  }
  humanize(value: any) {
    return humanize(value);
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'new':
        return 'danger';
      case 'progress':
        return 'warning';
      case 'completed':
        return 'success';
      default:
        return 'medium';
    }
  }

  getSanitizedUrl = (url: string) => this.sanitizer.bypassSecurityTrustResourceUrl(url);
  getSanitizedStyle = (url: string) => this.sanitizer.bypassSecurityTrustStyle(`url(${url})`);

  // STORAGE

  getStorage<T>(key: string) {
    // todo move to cap storage Storage.requestPermissions()
    return JSON.parse(localStorage.getItem(key)) as T;
  }
  setStorage<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
    return value;
  }
  deleteStorage(key: string) {
    localStorage.removeItem(key);
  }

  // OBJECT HELPERS

  arrPropCount(arr: any[], key: string) {
    return arr?.filter((s) => s[key]).length;
  }

  toKeys(o: any, truthyKeys = true) {
    if (o && typeof o == 'object') {
      if (truthyKeys === true) {
        return Object.entries(o)
          .filter(([key, val]) => !!val)
          .map(([key, val]) => key)
          .join(', ');
      }

      return Object.keys(o);
    }
    return '';
  }

  addRemoveArray(add: boolean, value: any, arr: any[]) {
    if (add) {
      if (!arr.find((item) => item == value)) {
        arr.push(value);
      }
    } else {
      const index = arr.findIndex((t) => t == value);
      if (index !== -1) {
        arr.splice(index, 1);
      }
    }

    return arr;
  }

  /**
   * https://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript
   */
  compareArrays(arrA: any[], arrB: any[]) {
    // check if lengths are different
    if (arrA.length !== arrB.length) return false;

    // slice so we do not effect the original
    // sort makes sure they are in order
    // join makes it a string so we can do a string compare
    const cA = arrA.slice().sort().join(',');
    const cB = arrB.slice().sort().join(',');

    return cA === cB;
  }

  deepCloneJSON<T>(object: any) {
    return JSON.parse(JSON.stringify(object)) as T;
  }

  deepClone(obj: any) {
    const clone = {};
    for (const i in obj) {
      if (obj[i] != null && typeof obj[i] === 'object') {
        clone[i] = this.deepClone(obj[i]);
      } else {
        clone[i] = obj[i];
      }
    }
    return clone;
  }

  /** for use in angular templates */
  isArray(data: any) {
    return Array.isArray(data);
  }

  /**
   * {id1: {name: 'Owen'}} > [{id: id1, name: 'Owen'}]
   * this.chat.users1 = this.util.objectToArray(JSON.parse(JSON.stringify(chat.users1)), 'uid');
   */
  objectToArray(object: Record<string, any>, idParamName = 'id') {
    if (!object) return [];

    return Object.keys(object).map((key) => {
      const value = object[key];
      if (value) {
        // add id as a prop
        value[idParamName] = key;
        return value;
      }
    });
  }

  objectToArrayWithId(model: any) {
    return Object.entries(model || {}).map(([id, value]) => ({ id, ...(value as any) }));
  }

  upsertIntoArray(arr: any[], item: any, idKey: string, prevId?: string) {
    arr = arr || [];
    const newId = item[idKey];

    if (!prevId) {
      // create or find and update
      const i = arr.findIndex((t) => t[idKey] == newId);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      i > -1 ? arr.splice(i, 1, item) : arr.push(item);
    } else {
      // update
      //  * 1 id's are same
      //  * 2 id's are diff & duplicate exists with newId

      if (newId == prevId) {
        // find and update
        const i = arr.findIndex((j) => j[idKey] == prevId);
        if (i > -1) {
          arr[i] = item;
        }
      } else {
        // updating: prevId: tag2 with tag:{name: tag1}

        // delete old
        const i = arr.findIndex((k) => k[idKey] == prevId);
        if (i > -1) arr.splice(i, 1);

        // upsert new
        // if duplicate: overwrite existing tag1
        // else
        const j = arr.findIndex((t) => t[idKey] == newId);
        if (j > -1) arr.splice(j, 1, item);
        else {
          arr.splice(i, 0, item);
        }
      }
    }

    return arr;
  }
}

export const humanize = (value: any) => {
  if (typeof value !== 'string') {
    return value;
  }
  value = value.split(/(?=[A-Z])/).join(' ');
  value = value[0].toUpperCase() + value.slice(1);
  return value;
};

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export const getRandomNumber = (min: number, max: number) => Math.random() * (max - min) + min;

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
