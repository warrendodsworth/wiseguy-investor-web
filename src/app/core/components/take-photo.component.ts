import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Photo } from '../models/photo';
import { PhotoService } from '../services/photo.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';

@Component({
  selector: 'app-take-photo',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <p class="ion-text-center">
      <a (click)="presentActionSheet()">{{ photoUrl ? 'Change' : 'Add' }} Photo</a>
    </p>
  `,
})
export class TakePhotoComponent {
  constructor(private _photo: PhotoService) {}

  @Input() photoUrl: string; // change btn if has photo
  @Input() action: 'take-upload' | 'take' = 'take-upload';

  // take-upload
  @Input() filePath?: string; // if you want to set it
  @Output() photo = new EventEmitter<Photo>();

  // take
  @Output() dataUrl = new EventEmitter<string>();

  async presentActionSheet() {
    switch (this.action) {
      case 'take':
        const p1 = await this._photo.presentPhotoSheet('take');
        this.dataUrl.emit(p1.url);
        break;
      case 'take-upload':
        const p = await this._photo.presentPhotoSheet('take-upload', this.filePath);
        this.photo.emit(p);
        break;
      default:
        console.error('[app-take-photo] component has invalid mode');
    }
  }
}
