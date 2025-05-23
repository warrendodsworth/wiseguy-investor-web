import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentChangeAction,
  QueryFn,
} from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { Entity } from '../models/_entity';
import { mapArrayISOs, mapObjectISOs, now, toISOs, toTimestamp, toTimestamps } from './date.service';
import { UtilService } from './util.service';

type CollectionPredicate<T> = string | AngularFirestoreCollection<T>;
type DocPredicate<T> = string | AngularFirestoreDocument<T>;

// timestamp for sending, string on get for datepicker & display
export type DatePredicate = firebase.firestore.Timestamp | string;

@Injectable({ providedIn: 'root' })
export class BaseFirestoreService {
  constructor(public afs: AngularFirestore, public afAuth: AngularFireAuth, public util: UtilService) {}

  get working() {
    return this._working.value;
  }

  private _working = new BehaviorSubject<boolean>(false);

  doc<T>(ref: DocPredicate<T>): AngularFirestoreDocument<T> {
    return typeof ref === 'string' ? this.afs.doc<T>(ref) : ref;
  }
  doc$<T>(ref: DocPredicate<T>): Observable<T> {
    return this.doc(ref)
      .snapshotChanges()
      .pipe(
        map((doc) =>
          // reverted as angularfire's valueChanges(idfield: 'id') returns an object with an id when the document doesn't exist
          doc.payload.data() ? ({ ...doc.payload.data(), id: doc.payload.id } as T) : null
        ),
        mapObjectISOs()
      );
  }
  doc_<T>(ref: DocPredicate<T>) {
    return this.doc$(ref).pipe(first()).toPromise();
  }

  col<T>(ref: CollectionPredicate<T>, queyrFn?: QueryFn): AngularFirestoreCollection<T> {
    return typeof ref === 'string' ? this.afs.collection<T>(ref, queyrFn) : ref;
  }
  col$<T>(ref: CollectionPredicate<T>, queyrFn?: QueryFn): Observable<T[]> {
    return this.col(ref, queyrFn)
      .snapshotChanges()
      .pipe(
        map((docs) => docs.map((a) => ({ ...a.payload.doc.data(), id: a.payload.doc.id })) as T[]),
        mapArrayISOs()
      );
  }

  orQuery<T>(ref: CollectionPredicate<T>, ids: string[]) {
    const obsArr = ids
      .filter((id) => !!id)
      .map((id) => this.col<T>(ref, (q) => q.where('id', '==', id)).valueChanges({ idField: 'id' }));

    return combineLatest(obsArr).pipe(map((arr: any[]) => arr.flatMap((a) => a)));
  }

  getByIds<T>(ref: CollectionPredicate<T>, ids: string[]) {
    const obsArr = ids
      .filter((id) => !!id)
      .map((id) =>
        this.col<T>(ref)
          .doc(id)
          .get()
          .pipe(
            first(),
            map((d: any) => d.data() as T)
          )
          .toPromise()
      );

    return Promise.all(obsArr);
  }

  async duplicateDoc<T extends Entity>(ref: DocPredicate<T>, newRef: DocPredicate<T>) {
    const doc = await this.doc_(ref);

    this.set_(newRef, doc, { snackbarContent: 'Document duplicated' });
  }

  async set_<T extends Entity>(ref: DocPredicate<T>, data: T | any, options?: Partial<SetOptions>) {
    options = { ...new SetOptions(), ...options };
    // let loading: HTMLIonLoadingElement;
    // if (options.loading) {
    //   loading = await this.util.openLoading('Saving..');
    // }

    const { uid } = (await this.afAuth.currentUser) || {};
    const d = updateMetadata(data, uid);
    this._working.next(true);

    await this.doc(ref)
      .set(d, { merge: true })
      .finally(() => {
        this._working.next(false);
        // loading?.dismiss();
      });

    if (options.snackbar || options.snackbarContent) {
      this.util.openSnackbar(options.snackbarContent || 'Saved');
    }

    d.id = data.id;

    return toISOs<T>(d);
  }

  /**
   * Doc must exist
   * function added to prevent createDate being overwritten
   */
  async update_<T extends Entity>(ref: DocPredicate<T>, data: T | any, options?: Partial<SetOptions>) {
    options = { ...new SetOptions(), ...options };
    let loading: any;
    if (options.loading) {
      loading = this.util.openLoading('Saving..');
    }

    const { uid } = (await this.afAuth.currentUser) || {};
    const d = updateMetadata(data, uid, true);
    this._working.next(true);

    await this.doc(ref)
      .update(d)
      .finally(() => {
        this._working.next(false);
        loading?.close();
      });

    if (options.snackbar || options.snackbarContent) {
      this.util.openSnackbar(options.snackbarContent || 'Updated');
    }

    d.id = data.id;
    return d as T;
  }

  async delete<T>(ref: DocPredicate<T>, options?: Partial<DeleteOptions>) {
    options = { ...new DeleteOptions(), ...options };

    if (options.skipConfirm) {
      await this.doc(ref).delete();
      return true;
    }
    const confirm = await this.util.confirmDialog(
      options.confirmTitle || 'Delete',
      options.confirmBody,
      options.confirmButtonText
    );
    if (confirm) {
      await this.doc(ref).delete();

      if (options.snackbar || options.snackbarContent) {
        this.util.openSnackbar(options.snackbarContent || 'Deleted');
      }
    }

    return confirm;
  }
}

export const mapDocsIds = <T>() =>
  map<DocumentChangeAction<T>[], T[]>((items) =>
    items.map((a) => {
      return { ...a.payload.doc.data(), id: a.payload.doc.id };
    })
  );

export const updateMetadata = (data: any, uid: string = '', updateOnly = false) => {
  Object.entries(data).forEach(([k, v]) => {
    if (v === undefined) delete data[k];
  });

  // createDate - will be an ISO as it's converted when retrieved
  data = toTimestamps(data);

  const meta: Partial<Entity> = {
    editDate: now(),
    editUid: uid,
  };

  // don't overwrite create date when updating
  // ? double converting createDate - depcate as it's converted to a DatePredicate along with the other fields
  if (!updateOnly) {
    meta.createDate = toTimestamp(data.createDate) || now();
    meta.createUid = data.createUid || uid;
  }

  const d = { ...data, ...meta };
  delete d.doc; // pagination cursor
  delete d.id;
  return d;
};

// used in distinctUntilChanged arrays
export const compareDocIds = (x: Entity[], y: Entity[]) =>
  y
    .map((_) => _.id)
    .sort()
    .toString() ===
  x
    .map((_) => _.id)
    .sort()
    .toString();

export class SetOptions {
  /** show loading indicator */
  loading = false;
  snackbar = false;
  snackbarContent: string;
}

export class DeleteOptions {
  snackbar = true;
  snackbarContent?: string;

  skipConfirm = false;
  confirmTitle?: string;
  confirmBody?: string;
  confirmButtonText?: string;
}

// Can Update | Delete - will be checked by firestore.rules
// - checking them here wouldn't be much use as it's client side and they'd have to be checked on the server side anyway
