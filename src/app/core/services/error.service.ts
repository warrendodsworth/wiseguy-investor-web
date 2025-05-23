import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, Injector, NgZone } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Capacitor } from '@capacitor/core';
// import { FirebaseCrashlytics, StackFrame } from '@capacitor-community/firebase-crashlytics';
// import { fromError } from 'stacktrace-js';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  constructor(private injector: Injector, public afAnalytics: AngularFireAnalytics) {}

  /**
   * Firebase Crashlytics
   * todo log stack trace errors
   */
  // crash = async () => {
  //   await FirebaseCrashlytics.crash({ message: 'Test' });
  // };

  /**
   * Error Service
   */
  getClientErrName(err: Error): string {
    return `Oops ${err.name?.toLowerCase()}`;
  }

  getClientStack(err: Error): string {
    return err.stack;
  }

  getServerErrName(e: HttpErrorResponse): string {
    return e.status + ' ' + e.statusText + ' ' + e.name;
  }

  getServerErrMessage(e: HttpErrorResponse) {
    return e.message + ` ${e.error.error || e.error.summary}`; // can add res.url or error.statusText;
  }

  getServerStack(e: HttpErrorResponse): string {
    const { status, statusText, name, message, url, error } = e;

    return `${status} ${statusText}\n ${name} ${url}\n` + (error ? ` ${error.error || error.summary}` : `${message}`);
  }

  /**
   * params should be formatted strings of the description and the stack
   */
  async logError(name: string, message: string, stack: string, error?: Error) {
    console.error(name, message, '\n' + stack);

    // Bugsnag.notify({ name, message, stack });

    this.afAnalytics.logEvent('exception', { name, message, stack });

    if (Capacitor.getPlatform() != 'web') {
      // stacktrace.js stack can't be combined with domain & code
      // let stacktrace: StackFrame[];
      // if (error) {
      //   stacktrace = await fromError(error);
      //   FirebaseCrashlytics.recordException({ message: name + ' : ' + message, stacktrace });
      // } else {
      //   FirebaseCrashlytics.recordException({ message: name + ' : ' + message, domain: window.location.origin });
      // }
    }
  }

  showError(header: string, message?: string): void {
    if (!navigator.onLine) {
      if (Capacitor.getPlatform() != 'web') {
        message = `You may be offline`;
      }
      //  return; // consider no error toasts when offline as offline_icon is already seen in toolbar
    }

    const zone = this.injector.get(NgZone);

    zone.run(() => {
      setTimeout(() => {
        const snackBar = this.injector.get(MatSnackBar);
        const snackBarRef = snackBar.open(message, 'Close', { panelClass: ['warn'] });
        snackBarRef
          .onAction()
          .toPromise()
          .then(() => snackBarRef.dismiss());

        // const snackbar = this.injector.get(ToastController);
        // snackbar
        //   .create({
        //     header: header || `Sorry there's been an issue`,
        //     message,
        //     duration: 3000,
        //   })
        //   .then((_) => _.present());
      });
    });
  }
}

// showSuccess(message: string): void {
//   const snackBar = this.injector.get(MatSnackBar);
//   snackBar.open(message);
// }
