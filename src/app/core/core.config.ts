import { InjectionToken } from '@angular/core';
import { Theme } from './models/theme';

export const CORE_CONFIG = new InjectionToken<CoreConfig>('CoreConfig');

export function provideCoreConfig(config?: CoreConfig) {
  return Object.assign(new CoreConfig(), config);
}

export class CoreConfig {
  appTitle: string;
  theme?: Theme = new Theme('blue');

  sidenavStyle?: 'sidenav-lg' | 'sidenav-sm' = 'sidenav-lg';
  sidenavState?: 'open' | 'closed' = 'open';
  breadcrumbs?: 'title' | 'simple' | null = null;
  navigationPos?: 'side' | 'top' = 'side';
  navbarFixed?: true | false = true;
}
