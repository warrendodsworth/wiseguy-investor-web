import { Pipe, PipeTransform } from '@angular/core';
import { Duration } from 'luxon';

@Pipe({
  name: 'durationFormat',
})
export class DurationPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (value == null || value < 0) {
      return '';
    }

    const d = Duration.fromObject({ seconds: value });

    const hours = Math.floor(d.as('hours'));
    const minutes = Math.floor(d.as('minutes') % 60);
    const seconds = Math.floor(d.as('seconds') % 60);

    return `${hours ? hours + 'h' : ''} ${minutes ? minutes + 'm' : ''} ${seconds && seconds > 0 ? seconds + 's' : ''}`;
  }
}
