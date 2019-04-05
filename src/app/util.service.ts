import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';


@Injectable({ providedIn: 'root' })
export class UtilService {

  constructor(
    public toastr: ToastrService,
    private sani: DomSanitizer) { }

  getSanitizedUrl(url) {
    return this.sani.bypassSecurityTrustResourceUrl(url);
  }
  getSanitizedStyle(url) {
    return this.sani.bypassSecurityTrustStyle(`url(${url})`);
  }

  objectClone(obj) {
    var clone = {};
    for (var i in obj) {
      if (obj[i] != null && typeof (obj[i]) == "object")
        clone[i] = this.objectClone(obj[i]);
      else
        clone[i] = obj[i];
    }
    return clone;
  }
  objectToArray(object, idParamName = 'id') {
    if (!object) return [];

    return Object.keys(object).map((key) => {
      let o = object[key]
      if (o) {
        o[idParamName] = key
        return o
      }
    })
  }
}
