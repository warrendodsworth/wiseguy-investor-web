// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  prod: false,
  rootUrl: location.origin,
  gravatarURL: 'https://picsum.photos/200',
  iconURL: '/assets/icon.png',
  logoURL: '/assets/logo.png',

  serviceWorker: 'sw-main.js', // 'firebase-messaging-sw.js',
  useEmulators: true, // location.hostname === 'localhost'
  screenshotMode: false,

  unsplashKey: 'k_jzt59dqtyr0X_HenCGZ9CREjwNKWQMOE5hSu4WcL4',
  stripePublishableKey: 'pk_test_Vyr3TSJRlcWIX5QYUDL9odmB',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
