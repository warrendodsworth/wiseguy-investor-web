import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { UtilService } from '../../../core/services/util.service';
import { UnsplashPhoto, UnsplashResponse } from './unsplash-response';

@Injectable({ providedIn: 'root' })
export class UnsplashService {
  constructor(public http: HttpClient, public util: UtilService) {}
  API_KEY = environment.unsplashKey;
  API_ENDPOINT = `https://api.unsplash.com/search/photos?client_id=${this.API_KEY}&per_page=30`;

  getPhotos(term: string) {
    term = term?.trim().length ? term.trim() : 'surfing';

    return this.http.get<UnsplashResponse>(`${this.API_ENDPOINT}&query=${term}`).pipe(map((r) => r.results));
  }

  /**
   * trigger download - https://help.unsplash.com/en/articles/2511258-guideline-triggering-a-download
   * e.g. "https://api.unsplash.com/photos/P18Ld0Zx_jI/download?ixid=MnwyMTQ3MjF8MHwxfHNlYXJjaHwxfHx0ZXN8ZW58MHx8fHwxNjE1Njc2NDEz"
   */
  notifyUnsplashOfDownload(photo: UnsplashPhoto) {
    let dl = photo.links.download_location;
    if (dl.lastIndexOf('?') > -1) {
      dl += '&';
    } else {
      dl += '?';
    }
    this.http.get(dl + 'client_id=' + this.API_KEY).toPromise();
  }
}
