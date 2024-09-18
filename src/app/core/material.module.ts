import { CdkTableModule } from '@angular/cdk/table';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MAT_AUTOCOMPLETE_DEFAULT_OPTIONS, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';

import { LuxonDateAdapter } from './luxon-date-adapter';

// import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule } from '@angular/material-moment-adapter';
const MATERIAL_MODULES = [
  FlexLayoutModule,
  MatOptionModule,
  MatSnackBarModule,
  MatGridListModule,
  MatTreeModule,
  MatRippleModule,
  MatExpansionModule,
  MatButtonModule,
  MatToolbarModule,
  MatMenuModule,
  MatSelectModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatChipsModule,
  MatSidenavModule,
  MatCheckboxModule,
  MatCardModule,
  MatIconModule,
  MatTooltipModule,
  MatFormFieldModule,
  MatSlideToggleModule,
  MatSliderModule,
  MatListModule,
  MatProgressBarModule,
  MatDialogModule,
  MatRadioModule,
  MatStepperModule,
  MatBadgeModule,
  MatPaginatorModule,
  MatSortModule,
  MatTableModule,
  MatAutocompleteModule,
  MatTabsModule,
  MatDatepickerModule,
  // MatMomentDateModule,
  MatBottomSheetModule,
  CdkTableModule,
];

const DATE_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  imports: MATERIAL_MODULES,
  exports: MATERIAL_MODULES,
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500, horizontalPosition: 'left' } },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { width: '400px', autoFocus: true, hasBackdrop: true, disableClose: true },
    },
    { provide: MAT_AUTOCOMPLETE_DEFAULT_OPTIONS, useValue: { autoActiveFirstOption: true } },
    { provide: DateAdapter, useClass: LuxonDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS },
  ],
})
export class MaterialModule {}

// { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
