import { NgModule } from '@angular/core';
import { FormlyModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { FormlyMaterialModule } from '@ngx-formly/material';

import { SharedModule } from '../shared.module';
import { ListHeaderType } from './types/list-header.type';
import { ListTextType } from './types/list-text.type';
import { MultiCheckboxType } from './types/multicheckbox.type';
import { MatTextAreaType } from './types/overrides/textarea.type';
import { PhotoType } from './types/photo.type';
import { RateStarsType } from './types/rate-star.type';
import { RepeatType } from './types/repeat.type';
import { StepperType } from './types/stepper.type';
import { TabsType } from './types/tabs.type';
import { basicValidationMsgs } from './validation-messages';
import { emailValidator, ipValidator, urlValidator } from './validators';
import { CardWrapper } from './wrappers/card.wrapper';
import { OutlineWrapper } from './wrappers/outline.wrapper';
import { MaterialModule } from '../../core/material.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgPipesModule } from 'ngx-pipes';
import { MatInputType } from './types/overrides/input.type';
import { MatDatetimeType, MatDatetimeDialog } from './types/overrides/datetime.type';
import { FormlyFieldMatRangeComponent } from './types/slider.type';

@NgModule({
  declarations: [
    // overrides
    MatInputType,
    MatTextAreaType,
    MatDatetimeType,
    MatDatetimeDialog,

    FormlyFieldMatRangeComponent,
    MultiCheckboxType,

    // extras
    ListHeaderType,
    ListTextType,

    PhotoType,
    RepeatType,
    TabsType,
    StepperType,

    RateStarsType,
    MultiCheckboxType,

    // wrappers
    CardWrapper,
    OutlineWrapper,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgPipesModule,

    FormlyMaterialModule,
    FormlyModule.forRoot({
      types: [
        // overrides
        { name: 'input', component: MatInputType, wrappers: [] },
        { name: 'datetime', component: MatDatetimeType }, //  wrappers: ['form-field']
        { name: 'textarea', component: MatTextAreaType },

        // { name: 'checkbox', component: CustomFormlyFieldCheckboxType, wrappers: [] },
        // { name: 'toggle', component: CustomFormlyFieldToggleType },
        // { name: 'range-custom', component: CustomFormlyFieldSliderType }, // slider , wrappers: ['form-field']

        // extras
        { name: 'repeat', component: RepeatType },
        { name: 'stepper', component: StepperType, wrappers: [] },
        { name: 'tabs', component: TabsType },
        { name: 'list-header', component: ListHeaderType },
        { name: 'list-text', component: ListTextType },

        { name: 'photo', component: PhotoType },

        { name: 'rate-stars', component: RateStarsType },

        { name: 'multicheckbox', component: MultiCheckboxType }, // e.g. mate finder & fiter
      ],
      wrappers: [
        { name: 'card', component: CardWrapper },
        { name: 'outline', component: OutlineWrapper },
      ], // built in wrapper ['form-field']
      validators: [
        { name: 'ip', validation: ipValidator, options: {} },
        { name: 'url', validation: urlValidator, options: {} },
        { name: 'email', validation: emailValidator, options: {} },
      ],
      validationMessages: [...basicValidationMsgs],
      extras: {},
    }),
  ],
  exports: [FormlyModule, FormlyMaterialModule],
  providers: [
    /** for rate-gesture smiley  */
    // {
    //   provide: HAMMER_GESTURE_CONFIG,
    //   useClass: HammerConfig,
    // },
  ],
})
export class AppFormlyModule {}
