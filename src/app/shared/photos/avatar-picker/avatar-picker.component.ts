import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar-picker.component.html',
})
export class AvatarPickerComponent implements OnInit {
  constructor(public modalController: ModalController) {}
  AVATAR_COUNT = 15;
  avatars: string[];

  ngOnInit() {
    // Generate avatar paths NB: avatars must be labeled "avatarX.png" where X = index
    this.avatars = [...Array(this.AVATAR_COUNT).keys()].map((x) => `/assets/avatars/avatar${x}.png`);
  }

  selectAvatar(url: string) {
    url = environment.rootUrl + url;
    this.modalController.dismiss(url);
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
