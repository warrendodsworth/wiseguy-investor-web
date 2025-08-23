import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

import { AppUser, Roles } from '../../core/models/user';
import { AuthService } from '../../core/services/auth.service';
import { UtilService } from '../../core/services/util.service';
import { SharedModule } from '../../shared/shared.module';
import { profilePhotoField, displayNameField } from '../../core/formly/fields-app';
import { emailReadOnlyField } from '../../core/formly/fields-basic';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  standalone: true,
  imports: [SharedModule],
})
export class UserEditComponent implements OnInit {
  constructor(
    private location: Location,
    public router: Router,
    public route: ActivatedRoute,
    public auth: AuthService,
    public util: UtilService,
    protected cdRef: ChangeDetectorRef,
    public plt: Platform
  ) {}
  selectedSegment: string;

  form = new FormGroup({});
  options: FormlyFormOptions = { formState: {} };
  model: AppUser | any = null;

  userFields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'flex flex-col gap-1',
      fieldGroup: [
        profilePhotoField,

        { type: 'list-header', props: { label: 'Profile' } },
        displayNameField,
        emailReadOnlyField,

        {
          key: 'bio',
          type: 'textarea',
          props: {
            label: 'Bio',
            placeholder: 'Tell us a bit about yourself',
            rows: 6,
            autoGrow: true,
            autocapitalize: 'sentences',
          },
        },
        {
          key: 'address',
          type: 'input',
          props: {
            label: 'Town/City',
            labelPosition: 'stacked',
            autocapitalize: 'words',
            placeholder: 'e.g. Carlton, Melbourne',
          },
        },

        // userInterestsField,
        // userJoinReasonField,
        { type: 'list-header', props: { label: 'Privacy', bold: true } },
        {
          key: 'privacy',
          fieldGroup: [
            {
              type: 'list-text',
              className: 'text-wrap',
              props: { label: `Choose the information you want to share with your Mate` },
            },
            {
              key: 'userInterestsPublic',
              type: 'toggle',
              props: { label: `Interests`, disabled: this.model?.roles?.admin },
              // disabled doesn't work as expected though model roles is set when changed
            },
            {
              key: 'userJoinReasonPublic',
              type: 'toggle',
              props: { label: `Reason for Joining`, defaultValue: true },
            },
          ],
        },
      ],
    },
  ];
  adminFields: FormlyFieldConfig[] = [
    {
      hideExpression: '!formState.admin',
      fieldGroup: [
        { type: 'list-header', props: { label: 'For Admins', className: 'mb-3' } },
        {
          key: 'roles',
          type: 'multicheckbox',
          props: {
            label: 'Roles',
            options: Object.entries(new Roles()).map((r) => ({ label: r[0], value: r[0] })),
          },
        },
      ],
    },
  ];

  async ngOnInit() {
    this.selectedSegment = this.route.snapshot.queryParamMap.get('selectedSegment') || 'edit';
    const uid = this.route.snapshot.paramMap.get('uid');
    const currentUser = await this.auth.getUser();

    // incase admins needs to change email
    let email = '';
    if (currentUser.roles.admin && uid) {
      const meta = await this.auth.getUserMeta(uid);
      email = meta?.email;
    } else {
      email = (await this.auth.afAuth.currentUser).email;
    }
    this.model = await this.auth.getUser(uid);
    this.model.email = email;
    this.model.mateJoin = this.model.mateJoin || {};
    if (!this.model.photoURL) {
      this.model.photoURL = this.util.env.gravatarURL;
    }
    // this.model.mate = this.model.mate || {}; // temp until data migrated

    this.options.formState.mainModel = { ...this.model };
    this.options.formState.admin = currentUser.roles?.admin;
    this.cdRef.detectChanges();
  }

  async save(user: AppUser) {
    const updatedUser = await this.auth.updateUser(user, {}, true);
    const currentUser = await this.auth.afAuth.currentUser;
    // this.location.back(); // original choice

    if (this.options.formState.admin && currentUser.uid != updatedUser.uid) {
      this.router.navigate(['/accounts/users']);
    } else {
      this.router.navigateByUrl('/');
    }
  }

  // Designed for tabs of Profile and Edit
  togglePreview(value: string) {
    this.router.navigate(['.'], { queryParams: { selectedSegment: value }, relativeTo: this.route });
  }
}

// doesn't fire - because Formly’s change hook on a field does not listen to programmatic value changes
// change: (field: FormlyFieldConfig, event: any) => {
// // activate mate when verifying
// field.model.mateActive = event.detail.checked;
// // set interests public when verifying (force)
// Field doesn't exist when shown odd though hideExpr says do the opposite
// if (event.detail.checked) {
//   field.form.get('userInterestsPublic').setValue(event.detail.checked);
// }
// // add basic bio when verifying
// if (event.detail.checked) {
//   const bio = field.form.get('bio');
//   if (bio && !bio.value) {
//     bio.patchValue(`Hi, I'm ${field.model.displayName?.split(' ')[0]}. Nice to meet you.`);
//   }
// }
// },

// {
//   key: 'subscriptions',
//   type: 'multicheckbox',
//   templateOptions: {
//     label: 'Subscriptions',
//     options: Object.entries(new Subscriptions()).map(r => ({ label: r[0], value: r[0] })),
//   },
// },

// https://stackoverflow.com/questions/46101246/expressionchangedafterithasbeencheckederror-when-add-validator-in-ngoninit

//const tags = await this._tag.getActiveTags(TagCategory.Support);
// const supportAreas = findField('supportAreas', { fieldGroup: this.mateFields });
// if (supportAreas) {
//   supportAreas.templateOptions.options = tags.map((t) => ({ label: t.name, value: t.name }));
// }
