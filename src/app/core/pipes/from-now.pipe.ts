import { Pipe, PipeTransform } from '@angular/core';
import firebase from 'firebase/compat/app';
import { DateTime } from 'luxon';

import { DatePredicate } from '../services/base-firestore.service';

@Pipe({
  name: 'fromNow',
})
export class FromNowPipe implements PipeTransform {
  public transform(value: boolean | number | DatePredicate, mode?: string, prefixText?: string) {
    if (typeof value == 'boolean') {
      return 'online';
    }

    let date: DateTime;

    // calc
    if (typeof value == 'number') {
      date = DateTime.fromMillis(value as number);
    } else if (typeof value == 'string') {
      date = DateTime.fromISO(value);
      // console.log('Date String:', value);
    } else if ((value as any) instanceof firebase.firestore.Timestamp) {
      // console.log('Date Timestamp:', value.toDate().toISOString());
      date = DateTime.fromMillis((value as firebase.firestore.Timestamp).toMillis());
    } else {
      // don't mess up the ui handler
      return '';
    }

    // view
    prefixText = prefixText ? prefixText + ' ' : '';
    if (mode == 'time') {
      const diff = date.diffNow().negate();

      const h = Math.round(diff.as('hours'));

      if (h > 12) return null; // app-wide default

      return prefixText + date.toRelative();
    }

    const oneWeekAgo = DateTime.now().minus({ weeks: 1 });
    const unit = date > oneWeekAgo ? 'days' : 'weeks';

    return prefixText + date.toRelativeCalendar({ unit });
  }
}

// if (h > 0) {
//   return `${h} hours ago`;
// } else if (m > 0) {
//   return `${m} minutes ago`;
// } else if (s > 0) {
//   return `${s} seconds ago`;
// }
