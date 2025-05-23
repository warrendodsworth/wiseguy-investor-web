import { Pipe, PipeTransform } from '@angular/core';

/**
 * @unused as ion-textarea doesn't save \n on enter
 */
@Pipe({ name: 'linebreaks' })
export class LineBreaksPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/\\n/g, '<br />');
  }
}
