import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { DateTime } from 'luxon';

import { PhotoFile } from '../models/photo';
import { UtilService } from './util.service';

@Injectable({ providedIn: 'root' })
export class PhotoService {
  constructor(public util: UtilService) {}

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    let selectedFile: PhotoFile;

    reader.addEventListener('load', (event: any) => {
      selectedFile = new PhotoFile(event.target.result, file);
    });

    reader.readAsDataURL(file);

    return selectedFile;
  }

  uploadPhotoToFirebase(dataUrl: string, fileName: string = null) {
    fileName = !fileName ? DateTime.local().toISO() + '.jpg' : fileName;

    const imageRef = firebase.storage().ref(`${fileName}`);

    return imageRef.putString(dataUrl, firebase.storage.StringFormat.DATA_URL);
  }
}
