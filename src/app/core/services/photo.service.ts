import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Camera, CameraPlugin, CameraResultType, CameraSource, ImageOptions } from '@capacitor/camera';
import firebase from 'firebase/compat/app';
import { DateTime } from 'luxon';
import { combineLatest, Observable } from 'rxjs';
import { finalize, first, map } from 'rxjs/operators';

import { UnsplashSearchComponent } from '../../shared/unsplash/unsplash-search/unsplash-search.component';
import { FileData, Photo } from '../models/photo';
import { UtilService } from './util.service';
import { Capacitor } from '@capacitor/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BasicBottomSheetComponent } from '../components/basic-bottom-sheet.component';

@Injectable({ providedIn: 'root' })
export class PhotoService {
  constructor(
    private storage: AngularFireStorage,
    private util: UtilService,
    private rendererFactory: RendererFactory2,
    public bottomSheet: MatBottomSheet
  ) {
    this.camera = Camera;
    this.renderer = rendererFactory.createRenderer(null, null);
  }
  camera: CameraPlugin;
  renderer: Renderer2;

  async presentPhotoSheet(mode: 'take' | 'take-upload', filePath?: string, includeAvatar?: boolean) {
    const buttons = [
      // { text: 'Take a photo', icon: 'camera-outline', role: 'prompt' }, // prev - was not showing the cam/lib as predictably as prompt
      { text: 'Select a photo', icon: 'image-outline', role: 'library' },
      { text: 'Use Camera', icon: 'camera-outline', role: 'camera' },
      { text: 'Search Unsplash', icon: 'search-outline', role: 'unsplash' },
      { text: 'Cancel', role: 'cancel' },
    ];
    if (includeAvatar) buttons.push({ text: 'Choose an avatar', icon: 'happy-outline', role: 'avatar' });

    const sheet = await this.bottomSheet.open(BasicBottomSheetComponent, {
      data: { buttons, title: 'Select Image Source' },
      ariaLabel: 'Select Image Source',
    });
    const res = await sheet.afterDismissed().toPromise();

    if (res.role == 'prompt') {
      const dataURL = await this.takePhoto(CameraSource.Prompt);
      if (mode == 'take-upload') {
        return await this.uploadPhotoToFirebase(dataURL, filePath);
      } else {
        return new Photo(dataURL);
      }
    } else if (res.role == 'library') {
      const dataURL = await this.takePhoto(CameraSource.Photos);
      if (mode == 'take-upload') {
        return await this.uploadPhotoToFirebase(dataURL, filePath);
      } else {
        return new Photo(dataURL);
      }
    } else if (res.role == 'camera') {
      const dataURL = await this.takePhoto(CameraSource.Camera);
      if (mode == 'take-upload') {
        return await this.uploadPhotoToFirebase(dataURL, filePath);
      } else {
        return new Photo(dataURL);
      }
    } else if (res.role == 'unsplash') {
      const d = await this.util.openDialog(UnsplashSearchComponent, {});
      const { data } = await d.afterClosed().toPromise();
      return data ? new Photo(data.url, null, data.thumbnailURL, null) : null;
    }
    // else if (res.role == 'avatar') {
    //   const d = await this.util.openDialog(AvatarPickerComponent, {});
    //   const { data } = await d.afterClosed().toPromise();
    //   return data ? new Photo(data, null, data, null) : null;
    // }
    // todo refactor photo.type to handle unsplash most likely
    // null passed in to stop saving photoPath as undefined

    return null;
  }

  async uploadFile(dataURL: string, filePath: string, fileName?: string) {
    if (!dataURL) {
      console.log('[photo] dataURL empty');
      return null;
    }

    let _filePath = filePath;

    // enable passing a specific file name
    if (fileName) {
      const path = filePath.lastIndexOf('/');
      const ext = filePath.lastIndexOf('.');
      _filePath = filePath.substring(0, path) + '/' + fileName + filePath.substring(ext);
    }

    try {
      const uploadTask1 = this.storage.ref(_filePath).putString(dataURL, firebase.storage.StringFormat.DATA_URL);

      const progress = combineLatest([uploadTask1.percentageChanges()]).pipe(map(([p1]) => p1 / 2));
      this.showProgress(progress);

      const snap = await uploadTask1;
      snap.metadata.contentDisposition = `inline`;

      return new FileData(await snap.ref.getDownloadURL(), snap.metadata.fullPath);
    } catch (error) {
      console.error('[photo-service] uploadFile -> error', error);
      this.util.openSnackbar(`Sorry, couldn't save file`);
      return null;
    }
  }

  private async takePhoto(source: CameraSource = CameraSource.Prompt) {
    const cameraOptions: ImageOptions = {
      source,
      resultType: CameraResultType.DataUrl,
      quality: 85,
      width: 1080,
      height: 1080,
      allowEditing: false,
      saveToGallery: false,
      correctOrientation: true,
    };

    /** doesn't appear to do anything until getPhoto is called and asks for permission even otherwise */
    // const res = await this.camera.requestPermissions();
    // console.log('[photo] permissions response', res);

    // if (res?.results?.length == 0) {
    // this.util.openSnackbar(`Please allow camera access to continue`);
    // return null;
    // }

    try {
      const cameraPhoto = await this.camera.getPhoto(cameraOptions);
      return cameraPhoto.dataUrl;
    } catch (err) {
      throw { name: `we ran into some trouble`, message: err };
    }
  }

  async uploadPhotoToFirebase(dataURL: string, filePath?: string, resolution: number = 1080) {
    filePath = this.addJpgExtension(filePath);

    if (!dataURL) {
      console.log('[photo] dataURL empty');
      return null;
    }

    try {
      const imagePath =
        filePath.substring(0, filePath.lastIndexOf('.')) + '_1080' + filePath.substring(filePath.lastIndexOf('.'));
      const thumbnailPath =
        filePath.substring(0, filePath.lastIndexOf('.')) + '_360' + filePath.substring(filePath.lastIndexOf('.'));

      // for each image uploaded, convert to full (1080x1080) and thumb (360x360)
      const processedImage = await this.resizeImage(dataURL, resolution, this.renderer);
      const uploadTask1 = this.storage.ref(`${imagePath}`).putString(processedImage, firebase.storage.StringFormat.DATA_URL);

      // Note: pass processed image to uploadThumbnaioToFirebase function to speed up resizing
      const thumbnailImage = await this.resizeImage(processedImage, 360, this.renderer);
      const uploadTaskT = this.storage.ref(`${thumbnailPath}`).putString(thumbnailImage, firebase.storage.StringFormat.DATA_URL);

      const progress = combineLatest([uploadTask1.percentageChanges(), uploadTaskT.percentageChanges()]).pipe(
        map(([p1, p2]) => (p1 + p2) / 2)
      );
      this.showProgress(progress);

      const snap = await uploadTask1;
      const snapT = await uploadTaskT;

      return new Photo(
        await snap.ref.getDownloadURL(),
        snap.metadata.fullPath,
        await snapT.ref.getDownloadURL(),
        snapT.metadata.fullPath
      );
    } catch (error) {
      console.error('[photo-service] uploadPhotoToFirebase -> error', error);
      this.util.openSnackbar(`Sorry, couldn't save photo`);
      return null;
    }
  }

  resizeImage(dataURL: string, maxResolution: number, renderer: Renderer2, quality: number = 80): Promise<string> {
    const promise: Promise<string> = new Promise(function (resolve, reject) {
      quality = quality / 100;
      const sourceImage = new Image();

      sourceImage.onload = function () {
        const canvas: HTMLCanvasElement = renderer.createElement('canvas');
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

        const width = sourceImage.naturalWidth;
        const height = sourceImage.naturalHeight;

        const ratio = Math.min(Math.min(maxResolution / height, maxResolution / width), 1);

        canvas.width = width * ratio;
        canvas.height = height * ratio;

        ctx.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);

        // const mime = dataURL.substr(5, dataURL.split(';')[0].length - 5); // - for keeping mime type
        const mime = 'image/jpeg';
        const result = canvas.toDataURL(mime, quality);

        resolve(result);
      };

      sourceImage.src = dataURL;
    });

    return promise;
  }

  deleteFile(filePath: string) {
    return this.storage.ref(filePath).delete().pipe(first()).toPromise();
  }

  /** uninstalled photoviewer as it has kotlin java build issues 1.6 to 1.4 */
  viewPhoto(url: string, title: string = null, share: boolean = true) {
    // web not used - web version has top bar positioning issues, app version works.
    // <div id="photoviewer-container"></div>;
    // if (this.platform.is('capacitor')) {
    // PhotoViewer.show({ images: [{ url, title }], options: { share, title: true } });
    // }
  }

  private async showProgress(progress: Observable<number>) {
    const loading = await this.util.openLoading('Uploading..');
    progress.pipe(finalize(() => loading.close())).subscribe((p) => {
      // loading.setAttribute('message', 'Uploading ' + Math.trunc(p) + '%');
    });
  }

  private addJpgExtension(filePath?: string) {
    filePath = filePath || DateTime.local().toISO() + '.jpg';

    if (filePath && !filePath.endsWith('.jpg')) {
      filePath = filePath + '.jpg';
    }
    return filePath;
  }

  private getMime(dataURL: string) {
    return dataURL.substr(5, dataURL.split(';')[0].length - 5);
  }
}
