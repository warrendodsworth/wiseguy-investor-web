import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { DateTime } from 'luxon';

import { UtilService } from './util.service';


@Injectable()
export class PhotoService {

  constructor(public _util: UtilService) { }

  uploadPhotoToFirebase(dataUrl: string, fileName: string = null) {
    fileName = !fileName ? DateTime.local().toISO() + '.jpg' : fileName;

    const imageRef = firebase.storage().ref(`${fileName}`);

    return imageRef.putString(dataUrl, firebase.storage.StringFormat.DATA_URL)
  }

}

