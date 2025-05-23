import { Pipe, PipeTransform } from '@angular/core';

import { DatePredicate } from '../services/base-firestore.service';
import { toLuxonDateTime } from '../services/date.service';
import { UtilService } from '../services/util.service';

/**
 * calc age from jsdate/firestore.timestamp
 */
@Pipe({ name: 'age' })
export class AgePipe implements PipeTransform {
  constructor(private util: UtilService) {}

  /**
   * Convert a DOB into an Age: number
   */
  transform(value: DatePredicate): any {
    const birthday = toLuxonDateTime(value);

    return birthday ? Math.trunc(birthday.diffNow().negate().as('years')) : '';
  }
}
