import { CommonModule } from '@angular/common';
import { InjectionToken, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CORE_CONFIG, CoreConfig, provideCoreConfig } from './core.config';
import { MaterialModule } from './material.module';
import { DocPipe } from './pipes/doc.pipe';
import { DurationPipe } from './pipes/duration.pipe';
import { FromNowPipe } from './pipes/from-now.pipe';
import { AddHtmlLinksPipe } from './pipes/add-html-links.pipe';
import { AgePipe } from './pipes/age.pipe';
import { HumanizePipe } from './pipes/humanize.pipe';
import { LineBreaksPipe } from './pipes/line-breaks.pipe';
import { FirstNamePipe, InitialsPipe } from './pipes/name.pipe';
import { ScrollableDirective } from './directives/scrollable.directive';
import { AppConfig, UserPrefs } from './app-config';

const ui = [];
const pipesAndDirectives = [
  FromNowPipe,
  DurationPipe,
  DocPipe,
  FirstNamePipe,
  InitialsPipe,
  AgePipe,
  LineBreaksPipe,
  AddHtmlLinksPipe,
  HumanizePipe,

  ScrollableDirective,
];

export const APP = new InjectionToken<AppConfig>('AppConfig');
export const PREFS = new InjectionToken<UserPrefs>('Prefs');

@NgModule({
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, MaterialModule],
  declarations: [...ui, ...pipesAndDirectives],
  exports: [...ui, ...pipesAndDirectives],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      // needed as pipes need to be re-imported into each module
      // throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(coreConfig: CoreConfig, app?: Partial<AppConfig>, prefs?: Partial<UserPrefs>): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        { provide: CORE_CONFIG, useValue: coreConfig },
        { provide: CoreConfig, useFactory: provideCoreConfig, deps: [CORE_CONFIG] },

        { provide: APP, useValue: app },
        { provide: AppConfig, deps: [APP], useFactory: (a?: AppConfig) => Object.assign(new AppConfig(), a) },

        { provide: PREFS, useValue: prefs },
        { provide: UserPrefs, deps: [PREFS], useFactory: (p?: UserPrefs) => Object.assign(new UserPrefs(), p) },
      ],
    };
  }
}
