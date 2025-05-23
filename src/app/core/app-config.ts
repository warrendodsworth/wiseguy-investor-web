import { Style } from '@capacitor/status-bar';

import { Entity } from './models/_entity';

export class AppConfig extends Entity {
  readonly version: number = 1;

  title: string;
  photoURL?: string = 'https://picsum.photos/100';

  tagline?: string;
  description: string;

  pages: MenuItem[];
}

export class MenuItem {
  id: string;
  name: string;
  icon: string;

  menuGroup: string; // home | help
}

export class UserPrefs {
  readonly version: number = 1;

  theme: Style = Style.Light;
}
