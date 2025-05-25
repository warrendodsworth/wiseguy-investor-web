import * as functions from 'firebase-functions';
import { DateTime } from 'luxon';

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  response.send(DateTime.now().toSQL() + ': Hello from Firebase!');
});
