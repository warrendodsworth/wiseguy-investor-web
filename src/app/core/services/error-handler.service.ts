import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector } from '@angular/core';

import { environment } from '../../../environments/environment';
import { ErrorService } from './error.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(e: Error | HttpErrorResponse) {
    const _error = this.injector.get(ErrorService);

    let name: string;
    let message: string;
    let stack: any;

    while ((e as any).rejection) {
      e = (e as any).rejection;
    }

    if (e instanceof HttpErrorResponse) {
      // server error
      name = _error.getServerErrName(e);
      message = _error.getServerErrMessage(e);
      stack = _error.getServerStack(e);

      if (e.error instanceof ErrorEvent) {
        // todo use filename, lineno
        // const { filename, lineno, message, timeStamp } = res.error;
      }

      if (!environment.prod && e.status != 0) {
        _error.showError(name, message);
      }
    } else {
      // client error (Angular Error, ReferenceError...)
      name = _error.getClientErrName(e);
      message = e.message;
      stack = _error.getClientStack(e);

      // unknown capcacitor error Aug 2021
      if (!environment.prod) {
        _error.showError(name, message);
      }
    }

    if (environment.prod) {
      _error.logError(name, message, stack, e);
    } else {
      console.error(name, message, '\n' + stack);
      throw e;
    }
  }
}

// *1 - http promises get wrapped by zonejs removing their HttpErrorResponse props
// https://github.com/angular/angular/issues/27840
// https://github.com/angular/angular/commit/2bb9a6535115ad8ba3c56781a4fe4141936cefe6
