import { Pipe, PipeTransform } from '@angular/core';

import { UtilService } from '../services/util.service';

@Pipe({
  name: 'humanize',
})
export class HumanizePipe implements PipeTransform {
  constructor(private util: UtilService) {}

  transform(value: string) {
    return this.util.humanize(value);
  }
}
