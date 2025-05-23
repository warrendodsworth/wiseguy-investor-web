import { Inject, Optional } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection, Query, QueryDocumentSnapshot, QueryFn } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, take } from 'rxjs/operators';

import { Entity } from '../models/_entity';
import { BaseFirestoreService, DeleteOptions, SetOptions } from './base-firestore.service';
import { toISOs } from './date.service';
import { UtilService } from './util.service';

export abstract class EntityBaseFirestoreService<R extends Entity, L1 extends Entity = null> extends BaseFirestoreService {
  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public util: UtilService,
    @Inject('') public root: string,
    @Inject('') @Optional() public inner?: string
  ) {
    super(afs, afAuth, util);
  }

  /** Root collection */

  manyRef = (q?: QueryFn) => this.col<R>(`${this.root}`, q);
  many$ = (q?: QueryFn) => this.col$(this.manyRef(q));

  oneRef = (id: string) => this.doc<R>(`${this.root}/${id}`);
  one$ = (id: string) => this.doc$(this.oneRef(id));
  one_ = (id: string) => this.doc$(this.oneRef(id)).pipe(first()).toPromise();

  _set(id: string, data: Partial<R>, options?: Partial<SetOptions>) {
    if (!id) id = this.afs.createId();

    return super.set_(this.oneRef(id), data, options);
  }

  _update(id: string, data: Partial<R>, options?: Partial<SetOptions>) {
    if (!id) throw new Error('Id not provided');

    return super.update_(this.oneRef(id), data, options);
  }

  delete(id: string, options?: Partial<DeleteOptions>) {
    if (!id) {
      console.warn('Id not provided');
      return Promise.resolve(false);
    }
    return super.delete(this.oneRef(id), options);
  }

  /** Level 1 collection */

  manyL1Ref = (id1: string, q?: QueryFn) => this.col<L1>(`${this.root}/${id1}/${this.inner}`, q);
  manyL1$ = (id1: string, q?: QueryFn) => this.col$(this.manyL1Ref(id1, q));

  oneL1Ref = (id1: string, id2: string) => this.doc<L1>(`${this.root}/${id1}/${this.inner}/${id2}`);
  oneL1$ = (id1: string, id2: string) => this.doc$(this.oneL1Ref(id1, id2));

  _setL1(id1: string, id2: string, data: Partial<L1>, options?: Partial<SetOptions>) {
    if (!id2) {
      id2 = data.id = this.afs.createId();
    }
    return this.set_(this.oneL1Ref(id1, id2), data, { snackbar: true, ...options });
  }

  _updateL1(id1: string, id2: string, data: Partial<L1>, options?: Partial<SetOptions>) {
    return super.update_(this.oneL1Ref(id1, id2), data, { snackbar: true, ...options });
  }

  _deleteL1(id1: string, id2: string, options?: Partial<DeleteOptions>) {
    if (!id1 || !id2) {
      console.warn('Id not provided', id1, id2);
      return Promise.resolve(false);
    }
    return super.delete(this.oneL1Ref(id1, id2), options);
  }

  /**
   * Pagination
   */

  private _done = new BehaviorSubject(false);
  private _loading = new BehaviorSubject(false);

  done: Observable<boolean> = this._done.asObservable();
  loading: Observable<boolean> = this._loading.asObservable();

  // Notes - takeCount passed as parameterr because Users page works with takeCount = 2 and messages needs takeCount = 1

  firstPage(query: QueryConfig, takeCount: number = 2, qf1?: QueryFn) {
    this._done.next(false);

    query = { limit: 10, reverse: false, prepend: false, ...query };
    if (!query.path) query.path = this.root;

    const qf: QueryFn = ref => {
      let q: Query = qf1 ? qf1(ref) : ref;

      q = q.orderBy(query.orderByField, query.reverse ? 'desc' : 'asc').limit(query.limit);
      return q;
    };

    const firstPage = this.afs.collection(query.path, qf);

    return this.mapAndUpdate(firstPage, query, takeCount);
  }

  async nextPage(existingData: any[], query: QueryConfig, takeCount: number = 2, qf1?: QueryFn) {
    const cursor = this.getCursor(existingData, query);
    if (!cursor) return Promise.resolve([]); // !temp fix - ion-infinite loadMore seems to be called at random times

    const qf: QueryFn = ref => {
      let q: Query = qf1 ? qf1(ref) : ref;
      q = q
        .orderBy(query.orderByField, query.reverse ? 'desc' : 'asc')
        .limit(query.limit)
        .startAfter(cursor);
      return q;
    };

    const nextPage = this.afs.collection(query.path, qf);

    const data = await this.mapAndUpdate(nextPage, query, takeCount);
    if (!data) return existingData;

    return query.prepend ? data.concat(existingData) : existingData.concat(data);
  }

  private getCursor(items?: any[], query?: QueryConfig): QueryDocumentSnapshot<any> {
    const current = items;
    if (current.length) {
      return (query ? query.prepend : query.prepend) ? current[0].doc : current[current.length - 1].doc;
    }
    return null;
  }

  private async mapAndUpdate(col: AngularFirestoreCollection<any>, query?: QueryConfig, takeCount: number = 2) {
    if (this._done.value || this._loading.value) return null;

    this._loading.next(true);

    const arr = await col
      .get()
      .pipe(take(takeCount)) // taking 2, quick workaround, 1st set of values are from cache)
      .toPromise();

    // Map snapshot with doc ref (needed for cursor)
    let values = arr.docs.map(snap => {
      const doc = snap;
      const data = toISOs({ ...snap.data() });
      return { ...data, id: doc.id, doc };
    });

    // If prepending, reverse the batch order
    values = query.prepend ? values.reverse() : values;

    // update source with new values, done loading
    // this._data.next(values); // || this._data.value; - initial: not reusable - single results list per service design
    this._loading.next(false);

    // no more values, mark done
    // Removed by Roger Middenway - stops messages from loading if multiple chats exist
    // (eg. chat 1 completes, _done = true, mapAndUpdate returns null when loading chat 2)
    if (!values.length) this._done.next(true);

    // this done is a singleton - doesn't care about multiple chats - reset in firstPage

    return values;
  }
}

export interface QueryConfig {
  /** path to collection */
  path: string;
  orderByField: string;
  limit: number;

  /** reverse order */
  reverse: boolean;

  /** prepend to source when loading next page */
  prepend: boolean;
}

/** not required */
// private buildQuery(orderByField: string, query: QueryConfig = null, nextPage = false) {
//   query = { orderByField, limit: 10, reverse: false, prepend: false, ...query };

//   const cursor = this.getCursor();

//   const qf: QueryFn = ref => {
//     let q: Query = ref;

//     q = q.orderBy(query.orderByField, query.reverse ? 'desc' : 'asc').limit(query.limit);

//     if (nextPage) {
//       q = q.startAfter(cursor);
//     }
//     return q;
//   };

//   return qf;
// }

// this.data = this._data.asObservable().pipe(scan((acc, val) => (query.prepend ? val.concat(acc) : acc.concat(val))));
