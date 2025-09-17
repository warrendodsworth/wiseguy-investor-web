import { Component, Injectable, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

import { AuthService } from '../../core/services/auth.service';
import { UtilService } from '../../core/services/util.service';
import { State, Store } from '../../core/store';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';
import { MatDialogRef } from '@angular/material/dialog';

export class UserListPageState extends State {
  role!: string;
  mateActive!: boolean | string;
  joinStatus!: string;
}

@Injectable({ providedIn: 'root' })
export class UserListPageStore extends Store<UserListPageState> {
  constructor() {
    super(new UserListPageState(), '@user-list-page-state');
  }
}

@Component({
  selector: 'app-resoure-list-popover',
  standalone: true,
  imports: [CoreModule, SharedModule],
  template: `
    <form [formGroup]="form">
      <formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>
    </form>
  `,
})
export class UserListFilterComponent implements OnInit {
  constructor(
    public auth: AuthService,
    public util: UtilService,
    public dialogRef: MatDialogRef<UserListFilterComponent>,
    public _store: UserListPageStore
  ) {}

  form = new FormGroup({});
  options: FormlyFormOptions = {};
  model: any = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'role',
      type: 'radio',
      templateOptions: {
        label: 'Role',
        options: [
          { label: 'All', value: '' },
          { label: 'Admin', value: 'admin' },
          { label: 'Mentor', value: 'mentor' },
          { label: 'Mate', value: 'mate' },
          { label: 'User', value: 'user' },
        ],
        change: (field: FormlyFieldConfig, event: any) => {
          this._store.dispatch({ role: event.detail.value });
          this.close(event.detail.value); // not needed - as the filter is limited to user-list its state can be updated here
        },
      },
    },
    {
      key: 'mateActive',
      type: 'radio',
      templateOptions: {
        label: 'Mate active',
        options: [
          { label: 'All', value: '' },
          { label: 'Active', value: true },
          { label: 'Inactive', value: false },
        ],
        change: (field: FormlyFieldConfig, event: any) => {
          this._store.dispatch({ mateActive: event.detail.value });
          this.close(event.detail.value); // not needed - as the filter is limited to user-list its state can be updated here
        },
      },
      hideExpression: 'model.role!="mate"',
    },
    // show when mate verified == true or users
    {
      key: 'joinStatus',
      type: 'radio',
      templateOptions: {
        label: 'Mate join status',
        options: [
          { label: 'All Users', value: '' },
          { label: 'Signed up', value: 'signedUp' },
          { label: 'Training Started', value: 'trainingStarted' },
          { label: 'Training Complete', value: 'trainingComplete' },
          { label: 'Practice Chat Complete', value: 'practiceChatComplete' },
          { label: 'Police Check Complete', value: 'policeCheckComplete' },
          { label: 'Interview Complete', value: 'interviewComplete' },
          { label: 'Verification Issue', value: 'verificationIssue' },
        ],
        change: (field: FormlyFieldConfig, event: any) => {
          this._store.dispatch({ joinStatus: event.detail.value });
          this.close(event.detail.value); // not needed - as the filter is limited to user-list its state can be updated here
        },
      },
      hideExpression: 'model.role!="user"',
    },
  ];

  ngOnInit() {
    this.model = this._store.state;
  }

  close(result?: string) {
    this.dialogRef.close(result || null);
  }
}
