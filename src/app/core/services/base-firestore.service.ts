import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, QueryFn } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Entity } from '../models/_entity';
import { User } from '../models/user';
import { AuthService } from './auth.service';
import { UtilService } from './util.service';

type CollectionPredicate<T> = string | AngularFirestoreCollection<T>;
type DocPredicate<T> = string | AngularFirestoreDocument<T>;

// timestamp for sending, string on get for datepicker & display
export type DatePredicate = firebase.firestore.Timestamp | string;

@Injectable({ providedIn: 'root' })
export class BaseFirestoreService {
  constructor(public afs: AngularFirestore, public auth: AuthService, public util: UtilService) {
    auth.currentUser$.subscribe(u => (this.user = u));
  }
  user: User;

  get newId() {
    return this.afs.createId();
  }

  col<T>(ref: CollectionPredicate<T>, queyrFn?: QueryFn): AngularFirestoreCollection<T> {
    return typeof ref === 'string' ? this.afs.collection<T>(ref, queyrFn) : ref;
  }

  doc<T>(ref: DocPredicate<T>): AngularFirestoreDocument<T> {
    return typeof ref === 'string' ? this.afs.doc<T>(ref) : ref;
  }

  doc$<T>(ref: DocPredicate<T>): Observable<T> {
    return this.doc(ref)
      .snapshotChanges()
      .pipe(
        map(doc => {
          const data = doc.payload.data();
          const id = doc.payload.id;
          return { id, ...data } as T;
        }),
        map(this.util.toISOs)
      );
  }

  col$<T>(ref: CollectionPredicate<T>, queyrFn?: QueryFn): Observable<T[]> {
    return this.col(ref, queyrFn)
      .snapshotChanges()
      .pipe(
        map(docs => docs.map(a => a.payload.doc.data()) as T[]),
        this.mapISOs()
      );
  }

  colWithIds$<T>(ref: CollectionPredicate<T>, queyrFn?: QueryFn): Observable<T[]> {
    return this.col(ref, queyrFn)
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        }),
        this.mapISOs()
      );
  }

  async set<T extends Entity>(ref: DocPredicate<T>, data: any, _opts?: Partial<SetOptions>) {
    if (!this.auth.canEdit()) {
      this.util.openSnackbar('Unauthorized');
      return;
    }

    await this.doc(ref).set(
      {
        ...data,
        // id: data.id || this.afs.createId(),
        createUid: data.createUid || this.user.uid,
        createDate: data.createDate || this.timestamp,
        editUid: this.user.uid,
        editDate: this.timestamp,
      },
      { merge: true }
    );

    if (_opts.toast || _opts.toastContent) {
      this.util.openSnackbar(_opts.toastContent || 'Saved');
    }
  }

  mapISOs = <T>() => map<T[], T[]>(items => items.map<T>(this.util.toISOs));

  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  async delete<T>(ref: DocPredicate<T>) {
    if (!this.auth.canDelete()) {
      this.util.openSnackbar('Unauthorized');
      return;
    }

    const del = await this.util.confirmDelete('Delete');
    if (del) {
      await this.doc(ref).delete();
      this.util.openSnackbar('Deleted');
    }
    return del;
  }
}

@Pipe({ name: 'doc' })
export class DocPipe implements PipeTransform {
  constructor(private db: BaseFirestoreService) {}

  transform(value: any): Observable<any> {
    return this.db.doc$(value.path);
  }
}

class SetOptions {
  toast: boolean = false;
  toastContent: string;
}
