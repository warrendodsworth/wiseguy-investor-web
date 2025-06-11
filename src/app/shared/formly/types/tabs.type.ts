import { Component, OnInit } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-formly-field-tabs',
  template: `
    <mat-tab-group (selectedIndexChange)="tabChange($event)" class="mb-3">
      <mat-tab
        *ngFor="let tab of field.fieldGroup; let i = index; let last = last"
        [label]="tab.templateOptions.tabLabel || tab.templateOptions.label"
      >
        <ng-container *ngIf="activeTab === tab.templateOptions.tabLabel">
          <formly-field [field]="tab"></formly-field>
        </ng-container>
      </mat-tab>
    </mat-tab-group>

    <!-- The button can be placed outside the tab group if needed -->
    <!-- <button *ngIf="last" mat-raised-button color="primary" [disabled]="!form.valid" type="submit">Submit</button> -->
  `,
})
export class TabsType extends FieldType implements OnInit {
  activeTab: string;

  ngOnInit() {
    if (this.field.fieldGroup && this.field.fieldGroup.length > 0) {
      // Initialize the active tab to the label of the first tab
      this.activeTab = this.field.fieldGroup[0].templateOptions.tabLabel;
    }
  }

  tabChange(index: number) {
    // Update the active tab based on the index of the selected tab
    this.activeTab = this.field.fieldGroup[index].templateOptions.tabLabel;
  }

  isValid(field: FormlyFieldConfig): boolean {
    if (field.key) {
      return field.formControl.valid;
    }

    return field.fieldGroup.every((f) => this.isValid(f));
  }
}
