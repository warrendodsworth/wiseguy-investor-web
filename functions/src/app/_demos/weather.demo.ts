import * as functions from 'firebase-functions';
import fetch from 'node-fetch';
import { FUNCTIONS_ENDPOINT } from '../../environments/environment';

/**
 * tutorial - https://www.youtube.com/watch?v=pkgvFNPdiEs
 * walk-logger - when a walk is added, get the weather from getWeatherTrigger (mock fn) and update the database
 */

/**
 * on create walk - update it's weather walk.weather
 */
export const onCreateWalk = functions.firestore.document('walks/{id}').onCreate(async (snap) => {
  const { location } = snap.data();
  const body = JSON.stringify({ location });

  const response = await fetch(FUNCTIONS_ENDPOINT + '/demos-getWeatherFn', { method: 'POST', body });
  const weather = await response.json();

  await snap.ref.update({ weather });
});

/**
 * get weather httpfn()
 */
export const getWeatherFn = functions.https.onRequest((request, response) => {
  const { location } = JSON.parse(request.body);

  const WEATHER_MAP: any = {
    'Washington, DC': 23.4,
    'Paris, France': 21.9,
    'London, UK': 19.4,
  };

  const temperature = WEATHER_MAP[location];

  response.json({
    temperature,
    metric: 'celcius',
  });
});
