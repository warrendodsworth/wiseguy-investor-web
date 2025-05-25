import * as functions from 'firebase-functions';

import { environment } from '../../environments/environment';

export const errors = {
  unauthenticated: new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated'),
  missingParam: (msg?: string) => {
    if (!environment.prod) functions.logger.info(msg || 'Invalid params sent.');
    return new functions.https.HttpsError('invalid-argument', msg || 'Invalid params sent.');
  },
  unauthorized: (msg?: string) => {
    if (!environment.prod) functions.logger.info(msg || 'Permission denied.');
    return new functions.https.HttpsError('permission-denied', 'Permission denied' + (msg ? ': ' + msg : ''));
  },
};

export const firstName = (displayName: string) => {
  return displayName?.split(' ')[0] || '';
};

export const trueKeys = (data: any) => {
  const onlyTrueKeysObject = {};

  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const value = data[key];
      if (value) {
        onlyTrueKeysObject[key] = value;
      }
    }
  }
  return onlyTrueKeysObject;
};
