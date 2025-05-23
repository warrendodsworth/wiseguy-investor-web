import { DatePredicate } from '../services/base-firestore.service';

export class Entity {
  id: string;

  createDate: DatePredicate;
  createUid: string;

  editDate: DatePredicate;
  editUid: string;

  /** Pagination cursor (Firestore) */
  doc: any;
}
