import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class UtilService {
  constructor(public toastr: ToastrService, private sani: DomSanitizer) {}

  getSanitizedHtml(html: string) {
    return this.sani.bypassSecurityTrustHtml(html);
  }
  getSanitizedUrl(url: string) {
    return this.sani.bypassSecurityTrustResourceUrl(url);
  }
  getSanitizedStyle(imageUrl: string) {
    return this.sani.bypassSecurityTrustStyle(`url(${imageUrl})`);
  }

  objectClone(obj) {
    const clone = {};
    for (const i in obj) {
      if (obj[i] != null && typeof obj[i] === 'object') {
        clone[i] = this.objectClone(obj[i]);
      } else {
        clone[i] = obj[i];
      }
    }
    return clone;
  }
  objectToArray(object, idParamName = 'id') {
    if (!object) {
      return [];
    }

    return Object.keys(object).map(key => {
      const o = object[key];
      if (o) {
        o[idParamName] = key;
        return o;
      }
    });
  }
}
