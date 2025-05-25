import * as functions from 'firebase-functions';

import { UserService } from '../shared/user.model';
import { errors } from '../shared/util';

/**
 * Mark chat as practice chat complete for a Mate who's joining
 */

export const setPracticeChat = functions.https.onCall(async (data, ctx) => {
  if (!ctx.auth?.token) throw errors.unauthenticated;
  if (!(ctx.auth.token.mentor || ctx.auth.token.admin)) throw errors.unauthorized(`You're not authorized to call this endpoint.`);

  const promises: Promise<any>[] = [];
  // const chatId = data.chatId;
  const uid = data.uid;
  const practiceChatComplete = data.mateJoin.practiceChatComplete;
  const verificationIssue = data.mateJoin.verificationIssue;

  const userRef = UserService.userRef(uid);

  // update user
  promises.push(
    userRef.update({
      ['mateJoin.verificationIssue']: verificationIssue,
      ['mateJoin.practiceChatComplete']: practiceChatComplete,
    })
  );

  // notify user
  // todo `Your practice chat has been completed, time to book an interview`
  // const user = await UserService.getUser(uid);
  // promises.push(notifyUserPracticeChatComplete(user));

  return Promise.all(promises);
});
