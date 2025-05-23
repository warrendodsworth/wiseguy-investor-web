import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseFirestoreService } from '../services/base-firestore.service';

/**
 * used to load a reference in a template - {{ docA.referenceToDocB | doc | async }}
 */
@Pipe({
  name: 'doc',
})
export class DocPipe implements PipeTransform {
  constructor(private db: BaseFirestoreService) {}

  transform(value: any): Observable<any> {
    return this.db.doc$(value.path);
  }
}
