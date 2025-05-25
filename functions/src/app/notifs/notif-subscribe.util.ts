import { FieldValue } from '@google-cloud/firestore';

import { messaging } from '../../main';
import { UserService } from '../shared/user.model';
import { processTokens } from './notif-send.util';
import { MessagingTopicManagementResponse } from 'firebase-admin/lib/messaging/messaging-api';
import { topic } from 'firebase-functions/v1/pubsub';

export const unsubscribeFromTopics = (tokens: string[], topics: string[] | string) => {
  tokens = processTokens(tokens);
  if (tokens?.length == 0) return [];
  if (!Array.isArray(topics)) topics = [topics];

  console.log('notif:unsubscribeTokensFromTopics topics:', topics, ' tokens:' + tokens.map((t) => t.slice(0, 5)));
  return topics.map((topic) => messaging.unsubscribeFromTopic(tokens, topic));
};

export const subscribeToTopics = async (
  tokens: any,
  topics: string[] | string,
  uid?: string
): Promise<MessagingTopicManagementResponse[]> => {
  tokens = processTokens(tokens);
  if (tokens?.length == 0) return [];
  if (!Array.isArray(topics)) topics = [topics];

  const topicSubscriptionCalls = topics.map((topic) => messaging.subscribeToTopic(tokens, topic));
  const firstResponse = await topicSubscriptionCalls[0];
  await removeOldTokens1(firstResponse, tokens, uid);
  return Promise.all(topicSubscriptionCalls);
};

// todo improve as this would be called multiple times when bad tokens could be removed on the first go
// async function removeOldTokens(responses: MessagingTopicManagementResponse[], tokens: string[], uid?: string) {
//   const failedTokens: string[] = [];
//   const tokensToRemove: string[] = [];

//   // Tally up the failed tokens
//   responses.forEach((res) => {
//     if (res?.failureCount > 0) {
//       res.errors.forEach((err) => {
//         // Cleanup the tokens which are not registered anymore.
//         if (
//           err.error?.code === 'messaging/invalid-registration-token' ||
//           err.error?.code === 'messaging/registration-token-not-registered'
//         ) {
//           tokensToRemove.push(tokens[err.index]);
//         }
//         failedTokens.push(tokens[err.index]);
//       });

//       console.log(`Summary subToTopic - uid: ${uid} ${topic}`);
//       console.log('- tokens:', tokens?.length, ' success:', res.successCount);
//     }
//   });

//   // Remove invalid tokens
//   if (uid && tokensToRemove.length > 0) {
//     await UserService.userRef(uid).update({ fcmTokens: FieldValue.arrayRemove(...tokensToRemove) });

//     console.log(`- tokens to remove:`, tokensToRemove.length, 'failed tokens:', failedTokens.length);
//     console.log(tokensToRemove);
//   }
// }

async function removeOldTokens1(res: MessagingTopicManagementResponse, tokens: string[], uid?: string) {
  if (res?.failureCount > 0) {
    const failedTokens: string[] = [];
    const tokensToRemove: string[] = [];

    res.errors.forEach((err) => {
      // Cleanup the tokens which are not registered anymore.
      if (
        err.error?.code === 'messaging/invalid-registration-token' ||
        err.error?.code === 'messaging/registration-token-not-registered'
      ) {
        tokensToRemove.push(tokens[err.index]);
      }
      failedTokens.push(tokens[err.index]);
    });

    // Remove invalid tokens
    console.log(`Summary subToTopic - uid: ${uid} ${topic}, tokens:, ${tokens?.length} success: ${res.successCount}`);

    if (uid && tokensToRemove.length > 0) {
      await UserService.userRef(uid).update({ fcmTokens: FieldValue.arrayRemove(...tokensToRemove) });

      console.log(`- tokens to remove:`, tokensToRemove.length, 'failed tokens:', failedTokens.length);
      console.log(tokensToRemove);
    }
  }
}
