import { Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

import { PhotoService } from '../../../core/services/photo.service';

@Component({
  selector: 'app-formly-field-photo',
  template: `
    <div *ngIf="!to.type" class="position-relative">
      <picture
        *ngIf="to.showPlaceholder || formControl.value"
        [ngClass]="field.className || 'img-200h'"
        [style.backgroundImage]="'url(' + formControl.value + ')'"
        class="img-background img-placeholder d-block mx-auto position-relative"
      >
        <button mat-icon-button (click)="presentActionSheet()" style="position: absolute; bottom:-6px; right:0px;">
          <mat-icon>camera_alt</mat-icon>
        </button>
      </picture>
    </div>

    <!-- field as a list-item -> used in /pages/:id/edit - e.g. wellness quiz photos -->
    <!-- <ion-item *ngIf="to.type == 'item'">
      <ng-container *ngIf="model[fieldKey]; else elseTemplate">
        <ion-avatar slot="start" (click)="presentActionSheet()" class="cursor-pointer">
          <ion-img [src]="model[fieldKey]"></ion-img>
        </ion-avatar>
      </ng-container>
      <ng-template #elseTemplate>
        <ion-icon slot="start" name="camera" size="large" class="cursor-pointer" (click)="presentActionSheet()"></ion-icon>
      </ng-template>

      <ion-input [ionFormlyAttributes]="field" [formControl]="$any(formControl)"></ion-input>
    </ion-item> -->
  `,
})
export class PhotoType extends FieldType implements OnInit {
  constructor(private _photo: PhotoService) {
    super();
  }

  get fieldKey() {
    return this.field.key as string;
  }

  ngOnInit() {
    this.to.placeholder = this.to.placeholder || 'Click camera icon to upload or enter photo url';
    this.to.includeAvatar = this.to.includeAvatar || false;
  }

  /**
   * if !model.id > take
   * if model.id  > take & upload
   * * use: to.action to explicitly set
   */
  async presentActionSheet() {
    const filePath = this.to.filePath;
    const modelId = this.formState.mainModel?.id || this.model.id || this.field.parent.model?.id || this.model?.uid;
    const action = modelId ? 'take-upload' : 'take'; // || this.model?.uid if ( upload on select ) for profile pics
    const avatar = this.to.includeAvatar;

    switch (this.to.action || action) {
      case 'take':
        const p1 = await this._photo.presentPhotoSheet('take');
        if (p1?.url) {
          this.formControl.patchValue(p1.url);
        }
        break;
      case 'take-upload':
        const p = await this._photo.presentPhotoSheet('take-upload', filePath, avatar);
        if (p) {
          // add main photo 1080p
          this.formControl.patchValue(p.url); // saw an issue where thumbnail updated but not this
          this.model[this.fieldKey] = p.url;
          this.model[this.fieldKey + 'Path'] = p.path;

          // model key + thumb - to allow for more than one photo on a doc e.g. photoURL & coverURL
          this.model[this.fieldKey + 'Thumb'] = p.thumbnailURL;
          this.model[this.fieldKey + 'Thumb' + 'Path'] = p.thumbnailPath;
        }
        break;

      default:
        console.error('[app-take-photo] component has invalid mode');
    }
  }
}

//* if path key is the same then we're deleting the photo right after uploading it
//* since we're uploading photos to the same folder with the same filename, old photos will be overwritten
// if (this.model[photoPathKey]) {
//   this._photo.deleteFile(this.model[photoPathKey]);
// }
// if (this.model[thumbPathKey]) {
//   this._photo.deleteFile(this.model[thumbPathKey]);
// }
