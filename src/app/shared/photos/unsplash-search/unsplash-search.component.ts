import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';

import { Photo } from '../../../core/models/photo';
import { UtilService } from '../../../core/services/util.service';
import { UnsplashPhoto } from './unsplash-response';
import { UnsplashService } from './unsplash.service';
import { SharedModule } from '../../shared.module';
import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { State, Store } from '../../../core/store';
import { ConfigService } from '../../../core/services/config.service';

class UnsplashSearchPageState extends State {
  view: 'grid' | 'list' = 'grid';
  appId: string;
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
  standalone: true,
  imports: [SharedModule],
  providers: [UnsplashSearchStore],
})
export class UnsplashSearchComponent implements OnInit {
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public _unsplash: UnsplashService,
    public page: UnsplashSearchStore, // not used yet
    public config: ConfigService,
    public util: UtilService,
    public dialogRef: MatDialogRef<UnsplashSearchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  // todo observables
  searchBox = new FormControl();
  photos$: Observable<UnsplashPhoto[]>;

  @ViewChild('searchBox') searchBoxElement: MatInput;
  photos: UnsplashPhoto[] = [];
  working = false;
  term: string;
  // private isModal: HTMLIonModalElement;

  async ngOnInit() {
    // ! not working
    // setTimeout(() => {
    //   this.searchBoxElement.setFocus();
    // }, 500);
    this.term = this.route.snapshot.queryParamMap.get('term');
  }

  async searchPhotos(term: string) {
    try {
      this.working = true;
      this.photos = await this._unsplash.getPhotos(term).toPromise();
      // this.router.navigate(['.'], { queryParams: { term }, relativeTo: this.route });
    } finally {
      this.working = false;
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
