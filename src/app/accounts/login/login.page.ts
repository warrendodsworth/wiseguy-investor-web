import 'firebase/compat/auth';

import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { DateTime } from 'luxon';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from '../../core/services/auth.service';
import { ConfigService } from '../../core/services/config.service';
import { UtilService } from '../../core/services/util.service';
import { SharedModule } from '../../shared/shared.module';

type View = 'login' | 'signup' | 'forgotPassword';

@Component({
  templateUrl: 'login.page.html',
  standalone: true,
  imports: [SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public auth: AuthService,
    public util: UtilService,
    public config: ConfigService,
    protected afAuth: AngularFireAuth,
    private analytics: AngularFireAnalytics
  ) {
    this.handleWebRedirectLogin();
  }
  private destroy$ = new Subject();
  view: View = 'login';
  form = new FormGroup({});
  options: FormlyFormOptions = { formState: {} };
  model = { email: '', password: '', displayName: '' };
  fields: FormlyFieldConfig[] = [
    {
      key: 'displayName',
      type: 'input',
      templateOptions: {
        type: 'text',
        label: 'Preferred name or nickname',
        required: true,
        hideRequiredMarker: true,
        inputmode: 'text',
        autocomplete: 'name',
        autocapitalize: 'words',
      },
      hideExpression: (model: any, formState: any) => formState.view != 'signup',
    },
    {
      key: 'email',
      type: 'input',
      templateOptions: {
        type: 'email',
        label: 'Email',
        required: true,
        hideRequiredMarker: true,
        inputmode: 'email',
        autocomplete: 'email',
      },
      validators: { validation: ['email'] },
    },
    {
      key: 'password',
      type: 'input',
      templateOptions: {
        type: 'password',
        label: 'Password',
        required: true,
        hideRequiredMarker: true,
        minLength: 6,
      },
      hideExpression: (model: any, formState: any) => formState.view == 'forgotPassword',
      expressionProperties: {
        'templateOptions.autocomplete': (model: any, formState: any) =>
          formState.view == 'signup' ? 'new-password' : 'current-password',
      },
    },
  ];

  ngOnInit() {
    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.view = (params.get('view') as View) || this.view;
      this.options.formState.view = this.view; // formly options formstate.view needed for consistent hide expr execution
      this.analytics.setCurrentScreen(this.view);
    });
  }

  /**
   * After signin with redirect using Social logins | https://firebase.google.com/docs/auth/web/google-signin
   * https://stackoverflow.com/questions/46922658/how-to-detect-getredirectresult-state-after-signinwithredirect
   */
  private async handleWebRedirectLogin() {
    if (sessionStorage.getItem('web-redirect-login-in-progress')) {
      sessionStorage.removeItem('web-redirect-login-in-progress');

      try {
        const baseLoading = await this.util.openLoading('Please wait..');
        // const cred = await this.afAuth.getRedirectResult();
        // ! cred is null - still broken in angularfire 17

        const sub = this.afAuth.authState.subscribe(async (user) => {
          if (user) {
            const detailLoading = this.util.openLoading('Logging you in..');
            baseLoading.close();

            const d = DateTime.fromRFC2822(user.metadata.creationTime);
            const isNewUser = d.diffNow().negate().as('minute') < 1;

            await this.auth.updateUserPostLogin(user);

            if (isNewUser) this.auth.goChooseUserType();
            else if (this.util.env.prod) this.auth.goAffirmations();
            else this.goReturnUrlOrHome();

            baseLoading.close();
            detailLoading.close();

            // Unsubscribe after handling the user
            sub.unsubscribe();
          } else {
            baseLoading.close();
          }
        });
      } catch (error) {
        this.util.openSnackbar(`Sorry there's been an issue.`, error.message);
        console.error(`[login]`, error);
        // error.credential type: firebase.auth.AuthCredential
        // Signin error codes from firebase. Incase we need custom messages for users.
        // const errorCodes = ['auth/wrong-password', 'auth/too-many-requests', 'auth/user-not-found', 'auth/user-disabled'];
        // if(errorCodes.includes(error.code)){}
        // Bugsnag.notify({ name: error.code, message: error.message });
      }
    }
  }

  async loginEmail(model: any) {
    let detailLoading = null;
    let baseLoading = null;
    try {
      baseLoading = await this.util.openLoading('Please wait..');
      const cred = await this.afAuth.signInWithEmailAndPassword(model.email, model.password);

      if (cred.user) {
        detailLoading = await this.util.openLoading('Logging you in..');
        baseLoading.close();

        await this.auth.updateUserData(cred);

        if (this.util.env.prod) this.auth.goAffirmations();
        else this.goReturnUrlOrHome();

        detailLoading.close();
      } else {
        baseLoading.close();
      }
    } catch (error) {
      baseLoading?.close();
      detailLoading?.close();
      this.util.openSnackbar(error.message, '', 5000);
      // Bugsnag.notify({ name: error.code, message: error.message });
    }
  }

  async signupEmail(model: any) {
    const user = await this.auth.signupEmail(model);
    if (user) {
      await this.auth.goChooseUserType();
    }
  }

  async loginGoogle() {
    sessionStorage.setItem('web-redirect-login-in-progress', '1');
    await this.auth.loginGoogle();
    await this.auth.goAffirmations(); // for cap login
  }

  async loginApple() {
    sessionStorage.setItem('web-redirect-login-in-progress', '1'); // for web redirect login
    await this.auth.loginApple();
    await this.auth.goAffirmations(); // for cap login
  }

  async loginAnonymous() {
    await this.auth.loginAnonymous();
    await this.auth.goAffirmations();
  }

  async sendPasswordResetEmail(model: any) {
    try {
      await this.afAuth.sendPasswordResetEmail(model?.email);
      this.util.openSnackbar('Password reset email sent');
    } catch (error) {
      if (error.code == 'auth/user-not-found') {
        this.util.openSnackbar("Oops! We couldn't find a user with that email address", '', 3000);
      } else {
        this.util.openSnackbar(error.message, '', 5000);
        throw error;
      }
    }
  }

  changeView(view: View) {
    this.form.reset();
    this.router.navigate(['.'], { queryParams: { view }, relativeTo: this.route, queryParamsHandling: 'merge' });
  }

  goReturnUrlOrHome() {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    if (returnUrl) this.router.navigateByUrl(returnUrl);
    else this.auth.goHome();
  }

  ngOnDestroy() {
    this.destroy$.next(0);
    this.destroy$.complete();
  }
}
