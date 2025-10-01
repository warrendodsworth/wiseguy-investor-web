import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Auth, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, User } from '@angular/fire/auth';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { DateTime } from 'luxon';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Analytics, logEvent, setCurrentScreen } from '@angular/fire/analytics';
import { AuthService } from '../../core/services/auth.service';
import { ConfigService } from '../../core/services/config.service';
import { UtilService } from '../../core/services/util.service';
import { SHARED_CONFIG } from '../../shared/shared.config';

type View = 'login' | 'signup' | 'forgotPassword';

@Component({
  templateUrl: 'login.page.html',
  imports: [SHARED_CONFIG],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage implements OnInit, OnDestroy {
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public auth: AuthService,
    public util: UtilService,
    public config: ConfigService,
    protected authModular: Auth,
    private analytics: Analytics
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
      setCurrentScreen(this.analytics, this.view);
      logEvent(this.analytics, 'page_view', { page: this.view });
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
        // Modular API: listen for auth state changes
        const unsubscribe = onAuthStateChanged(this.authModular, async (user: User | null) => {
          if (user) {
            const detailLoading = this.util.openLoading('Logging you in..');
            baseLoading.close();

            const d = DateTime.fromRFC2822(user.metadata.creationTime as string);
            const isNewUser = d.diffNow().negate().as('minute') < 1;

            await this.auth.updateUserPostLogin(user);

            if (isNewUser) this.auth.goChooseUserType();
            else if (this.util.env.prod) this.auth.goAffirmations();
            else this.goReturnUrlOrHome();

            baseLoading.close();
            detailLoading.close();

            // Unsubscribe after handling the user
            unsubscribe();
          } else {
            baseLoading.close();
          }
        });
      } catch (error: any) {
        this.util.openSnackbar(`Sorry there's been an issue.`, error?.message);
        console.error(`[login]`, error);
      }
    }
  }

  async loginEmail(model: any) {
    let detailLoading = null;
    let baseLoading = null;
    try {
      baseLoading = await this.util.openLoading('Please wait..');
      const cred = await signInWithEmailAndPassword(this.authModular, model.email, model.password);

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
    } catch (error: any) {
      baseLoading?.close();
      detailLoading?.close();
      this.util.openSnackbar(error?.message, '', 5000);
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
      await sendPasswordResetEmail(this.authModular, model?.email);
      this.util.openSnackbar('Password reset email sent');
    } catch (error: any) {
      if (error?.code == 'auth/user-not-found') {
        this.util.openSnackbar("Oops! We couldn't find a user with that email address", '', 3000);
      } else {
        this.util.openSnackbar(error?.message, '', 5000);
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
