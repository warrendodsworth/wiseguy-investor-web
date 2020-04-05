import { DOCUMENT, Location } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import * as firebase from 'firebase';
import { DateTime, Zone } from 'luxon';
import { map } from 'rxjs/internal/operators/map';

import { environment } from '../../../environments/environment';
import { ConfirmDialogComponent } from '../components/confirm-dialog.component';

@Injectable({ providedIn: 'root' })
export class UtilService {
  constructor(
    private snackbar: MatSnackBar,
    public dialog: MatDialog,
    public location: Location,
    private sani: DomSanitizer,
    @Inject(DOCUMENT) public document: Document
  ) {}

  get env() {
    return environment;
  }

  // datetimes
  toTimestamp(isoDateString: string | firebase.firestore.Timestamp) {
    if (typeof isoDateString == 'string') {
      const date = DateTime.fromISO(isoDateString).toJSDate();
      return firebase.firestore.Timestamp.fromDate(date);
    }
  }

  toISO(timestamp: firebase.firestore.Timestamp) {
    return DateTime.fromJSDate(timestamp.toDate()).toISO();
  }

  toISOs<T>(obj: T) {
    if (!obj) return null;

    for (const [key, value] of Object.entries(obj)) {
      if (value instanceof firebase.firestore.Timestamp) {
        obj[key] = DateTime.fromJSDate(value.toDate()).toISO();
      }
    }
    return obj as T;
  }

  // not working yet - convert all date strings to Timestamp/jsDate on save
  toTimestamps<T>(obj: T) {
    if (!obj) return null;

    // const isDatePredicate = (x: any): x is DatePredicate => {
    //   return typeof x == 'object' && x.seconds !== undefined && x.nanoseconds !== undefined;
    // };

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value == 'string' && DateTime.isDateTime(value)) {
        console.log(`date b/a`, value, obj[key]);
        obj[key] = this.toTimestamp(value);
      }
    }
    return obj as T;
  }

  mapToISO = <T>() => map<T[], T[]>(items => items.map<T>(this.toISOs));

  toUtc(isoDateString: string): DateTime {
    return DateTime.fromISO(isoDateString).setZone('UTC');
  }

  toTimezone(isoDateString: string, zone: string | Zone): DateTime {
    return DateTime.fromISO(isoDateString).setZone(zone);
  }

  // material
  openSnackbar(message: string) {
    return this.snackbar.open(message);
  }

  getStorage<T>(key: string) {
    return JSON.parse(localStorage.getItem(key)) as T;
  }

  setStorage<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
    return value;
  }

  // base
  toQs(filters: any) {
    return Object.keys(filters)
      .map(key => key + '=' + filters[key])
      .join('&');
  }

  deepClone<T>(object: any) {
    return JSON.parse(JSON.stringify(object)) as T;
  }

  async confirmGoBack(confim: boolean, body?: string) {
    if (confim) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: { title: 'Unsaved Changes', body: body || 'Changes will be lost', buttonText: 'Ok, got it', showClose: true },
      });

      const res = await dialogRef.afterClosed().toPromise();
      if (res) {
        this.location.back();
      }
    } else {
      this.location.back();
    }
  }

  async confirmDelete(title?: string, body?: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: title || 'Delete', body: body || 'Are you sure?', buttonText: 'Delete', showClose: true },
    });

    return await dialogRef.afterClosed().toPromise();
  }

  getSanitizedHtml(html: string) {
    return this.sani.bypassSecurityTrustHtml(html);
  }
  getSanitizedUrl(url: string) {
    return this.sani.bypassSecurityTrustResourceUrl(url);
  }
  getSanitizedStyle(imageUrl: string) {
    return this.sani.bypassSecurityTrustStyle(`url(${imageUrl})`);
  }

  objectToArray(object, idParamName = 'id') {
    if (!object) {
      return [];
    }

    return Object.keys(object).map(key => {
      const o = object[key];
      if (o) {
        o[idParamName] = key;
        return o;
      }
    });
  }

  scrollTo(id: string) {
    const el = this.document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
