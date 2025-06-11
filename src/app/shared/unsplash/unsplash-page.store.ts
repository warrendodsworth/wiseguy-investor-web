import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';

import { State, Store } from '../../core/store';
import { ConfigService } from '../../core/services/config.service';

class UnsplashSearchPageState extends State {
  view: 'grid' | 'list' = 'grid';
  appId: string;
}

@Injectable()
export class UnsplashSearchStore extends Store<UnsplashSearchPageState> {
  constructor(private config: ConfigService) {
    super(new UnsplashSearchPageState(), '@unsplashsearch');

    this.state$ = this.config._device.state$.pipe(
      switchMap((a) => this.actions.asObservable().pipe(map((s) => ({ ...s, ...{ appId: a.id } }))))
    );
  }
}
