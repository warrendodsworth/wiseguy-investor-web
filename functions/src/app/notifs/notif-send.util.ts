import { FieldValue } from '@google-cloud/firestore';
import admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { environment } from '../../environments/environment';
import { messaging } from '../../main';
import { UserService } from '../shared/user.model';

/**
 * FCM HTTP v1 API
 * https://firebase.google.com/docs/cloud-messaging/server
 */
export async function sendMulticast(msg: admin.messaging.MulticastMessage, uid?: string) {
  if (!environment.notify) {
    return Promise.resolve();
  }
  if (!msg.tokens || msg.tokens?.length == 0) {
    return functions.logger.info(`Tokens null or empty`);
  }

  const batchResponse = await messaging.sendMulticast(msg);

  if (batchResponse.failureCount > 0) {
    const failedTokens: string[] = [];
    const tokensToRemove: string[] = [];

    batchResponse.responses.forEach((res, idx) => {
      if (!res.success) {
        // Cleanup the tokens which are not registered anymore.
        if (
          res.error?.code === 'messaging/invalid-registration-token' ||
          res.error?.code === 'messaging/registration-token-not-registered'
        ) {
          tokensToRemove.push(msg.tokens[idx]);
        }
        // console.log(`err: `, res.error?.code, res.error?.message, msg.tokens[idx]);
        // note: title, body can't be a number AND token can't be any 'RandomString' -> messaging/invalid-argument err
        failedTokens.push(msg.tokens[idx]);
      }
    });

    // Remove invalid tokens
    console.log(`Summary sendMulticast - uid: ${uid}`);
    console.log('- tokens:', msg.tokens?.length, ' success:', batchResponse.successCount);

    if (tokensToRemove.length > 0) {
      if (uid) {
        await UserService.userRef(uid).update({ fcmTokens: FieldValue.arrayRemove(...tokensToRemove) });
      }

      console.log(`- tokens to remove:`, tokensToRemove.length, 'failed tokens:', failedTokens.length);
      console.log(tokensToRemove);
    }
  }

  return batchResponse;
}

/**
 * Accept token, tokens or deprecated fcmObject tokens
 * @return tokens[]
 */
export function processTokens(tokens: string | string[] | object): string[] {
  if (typeof tokens == 'string') {
    return [tokens];
  }

  const tokens1 = Array.isArray(tokens) ? ((tokens || []) as string[]) : Object.keys(tokens || {});
  return tokens1.filter((t) => t !== null && t !== undefined);
}

export function getBadge(user: any): number {
  return (user.chatRequestCount || 0) + (user.chatUnreadCount || 0);
}
