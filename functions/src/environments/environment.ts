import path from 'path';

const projectId = 'wiseguyapp'; // process.env.GCLOUD_PROJECT ;
const rootURL = `https://${projectId}.web.app`;
const prod = process.env.NODE_ENV == 'prod';

export const environment = {
  prod: process.env.NODE_ENV == 'prod',
  notify: process.env.NODE_ENV == 'prod',
  iconURL: rootURL + '/assets/icon.png',
  rootURL: rootURL,
  notificationColor: '#4267b0', // secondary #89d2e1, teal '#0cd1e8',
  gravatarURL: 'https://picsum.photos/200',
  COINMARKETCAP_BASE_URL: prod ? 'https://pro-api.coinmarketcap.com' : 'https://sandbox-api.coinmarketcap.com',
  COINMARKETCAP_API_KEY: prod ? '4f287594-1649-449d-8dc1-5835f7171716' : 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c',
};

export const projectConfig = {
  prod: {
    projectId: projectId,
    databaseURL: `https://${projectId}-default-rtdb.asia-southeast1.firebasedatabase.app`,
  },
};

export const serviceKeyPath = path.resolve(__dirname, '../../../service-key.json');

export const FUNCTIONS_ENDPOINT = `http://localhost:5001/${projectId}/us-central1`;

// todo
// figure out a way to make it change for live
// export const functionsBaseURL = environment.prod
//   ? `https://us-central1-${projectId}.cloudfunctions.net`
//   : `http://localhost:5001/${projectId}/us-central1`;
