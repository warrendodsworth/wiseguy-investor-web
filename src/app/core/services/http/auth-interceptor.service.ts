import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

// only for non firebase api based apps
@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const headers = { Accept: ['application/json', 'text/plain', '*/*'] };

    if (req.method !== 'GET') {
      headers['Content-Type'] = 'application/json';
    }

    const authReq = req.clone({
      setHeaders: headers,
    });

    return next.handle(authReq);
  }
}
