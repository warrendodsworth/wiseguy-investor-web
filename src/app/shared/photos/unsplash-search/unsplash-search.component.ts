import { Component, ViewChild, ChangeDetectionStrategy, signal, computed, inject, Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { firstValueFrom, map, switchMap } from 'rxjs';

import { Photo } from '../../../core/models/photo';
import { UtilService } from '../../../core/services/util.service';
import { UnsplashPhoto } from './unsplash-response';
import { UnsplashService } from './unsplash.service';
import { SharedModule } from '../../shared.module';
import { ConfigService } from '../../../core/services/config.service';
import { State, Store } from '../../../core/store';

class UnsplashSearchPageState extends State {
  view: 'grid' | 'list' = 'grid';
  appId: string | undefined;
}

@Injectable()
export class UnsplashSearchStore extends Store<UnsplashSearchPageState> {
  constructor(private config: ConfigService) {
    super(new UnsplashSearchPageState(), '@unsplashsearch');

    this.state$ = this.config.app$.pipe(
      switchMap((a) => this.actions.asObservable().pipe(map((s) => ({ ...s, ...{ appId: a.id } }))))
    );
  }
}

@Component({
  selector: 'app-unsplash-search',
  templateUrl: './unsplash-search.component.html',
  imports: [SharedModule],
  providers: [UnsplashSearchStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnsplashSearchComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  util = inject(UtilService);
  config = inject(UtilService);
  _unsplash = inject(UnsplashService);
  dialogRef = inject(MatDialogRef<UnsplashSearchComponent>);
  data = inject(MAT_DIALOG_DATA);

  searchBox = new FormControl();
  @ViewChild('searchBox') searchBoxElement!: MatInput;

  // AIM to use signals for this state management
  page = inject(UnsplashSearchStore);

  // Use signals for state
  private _photos = signal<UnsplashPhoto[] | undefined>([]);
  private _working = signal<boolean>(false);
  private _term = signal<string>('');

  photos = computed(() => this._photos());
  working = computed(() => this._working());
  term = computed(() => this._term());

  constructor() {
    const initialTerm = this.route.snapshot.queryParamMap.get('term') ?? '';
    this._term.set(initialTerm);
  }

  async searchPhotos(term: string) {
    this._working.set(true);
    try {
      const photos = await firstValueFrom(this._unsplash.getPhotos(term));
      this._photos.set(photos);
      this._term.set(term);
    } finally {
      this._working.set(false);
    }
  }

  async selectPhoto(photo: UnsplashPhoto) {
    this._unsplash.notifyUnsplashOfDownload(photo);
    const p = new Photo(photo.urls.regular, photo.urls.small);
    this.dialogRef.close(p);
  }

  closeDialog() {
    this.dialogRef?.close();
  }
}
