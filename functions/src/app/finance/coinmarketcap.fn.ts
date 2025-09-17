import * as functions from 'firebase-functions';
import axios from 'axios';
import { environment } from '../../environments/environment';

export const getCryptoData = functions.https.onCall(async (data, ctx) => {
  ctx.rawRequest.headers['Access-Control-Allow-Origin'] = '*';

  try {
    // Get endpoint and delete it from query params to send
    const params = { ...data };
    delete params.endpoint;

    // Fetch data from CoinMarketCap API
    const response = await axios.get(`${environment.COINMARKETCAP_BASE_URL}${data.endpoint}`, {
      headers: {
        'X-CMC_PRO_API_KEY': environment.COINMARKETCAP_API_KEY,
      },
      params, // Pass the query params
    });

    // Respond with the API data
    return response.data;
  } catch (error: any) {
    console.error('Error fetching data:', error.message);
    const e = error.errorInfo;
    throw new functions.https.HttpsError('internal', e.message, e.code);
  }
});
