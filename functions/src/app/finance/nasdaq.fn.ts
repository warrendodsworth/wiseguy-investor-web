import * as functions from 'firebase-functions';
import axios from 'axios';

export const getNasdaqData = functions.https.onCall(async (data, ctx) => {
  ctx.rawRequest.headers['Access-Control-Allow-Origin'] = '*';

  const symbol = data.symbol || '^IXIC'; // Default to NASDAQ composite (^IXIC)
  const timeframe: string = data.timeframe || '1Y'; // Default to 1 year if no timeframe is provided

  // Convert range to lowercase and replace 'M' with 'MO' if present
  let range = timeframe.toLowerCase();
  if (range.includes('m') && !range.includes('mo')) {
    range = range.replace('m', 'mo');
  }

  const yahooFinanceApiUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;

  try {
    // Fetch data based on the selected timeframe
    const response = await axios.get(yahooFinanceApiUrl, {
      params: {
        range: range, // Use the mapped range
        interval: '1d', // Daily interval
      },
    });

    // Respond with the API data
    return response.data;
  } catch (error: any) {
    console.error('Error fetching data:', error.message);
    throw new functions.https.HttpsError('internal', error.message);
  }
});
