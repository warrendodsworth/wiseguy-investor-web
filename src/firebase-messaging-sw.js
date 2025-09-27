importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js');

// Initialize Firebase app in the service worker
firebase.initializeApp({
  apiKey: 'AIzaSyAJgSfMcHiXkIbTdDi-8kI3KcT6kMwlefA',
  authDomain: 'insight-91.firebaseapp.com',
  projectId: 'insight-91',
  storageBucket: 'insight-91.firebasestorage.app',
  messagingSenderId: '563843062776',
  appId: '1:563843062776:web:a14494f0deb13d9d39d40d',
  measurementId: 'G-Q2YLQ3NTZC',
});

// Check if messaging is supported
if (firebase.messaging.isSupported()) {
  console.log('[fcmsw] messaging isSupported');
  const messaging = firebase.messaging();

  // Handle background messages - works when app is in background
  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
  });
}

// self.addEventListener('notificationclick', event => {
//   const { data } = event.notification;
//   const url = data.clickAction || data.FCM_MSG.notification.click_action || '/app/tabs/mates';

//   console.log('[notif] click_action', event);
//   // console.log(`clients`, clients);

//   event.notification.close();
//   event.waitUntil(
//     self.clients
//       .claim()
//       .then(() => self.clients.matchAll({ type: 'window' }))
//       .then(clients => {
//         if (!clients.length) {
//           return self.clients?.openWindow(url);
//         }

//         return clients.map(client => {
//           if ('navigate' in client) {
//             return client.navigate(url).then(c => c.focus());
//           }
//         });
//       })
//   );
// });

// not working
// messaging.setBackgroundMessageHandler(payload => {
//   console.log('[fcmsw] recd', payload);
//   const title = 'Hello';
//   const options = {
//     body: payload.data.status,
//     data: {
//       click_action: payload.data.click_action,
//     },
//   };
//   return self.registration.showNotification(title, options);
// });

// for (let i = 0; i < clients.length; i++) {
//   const client = clients[i];
//   if (client.url === '/' && 'focus' in client) {
//     return client.focus();
//   }
// }
// if (clients.openWindow) {
//   return clients.openWindow(url);
// }

// self.addEventListener('notificationclick', e => {
// do your notification magic
// close all notifications
// self.registration.getNotifications().then(function(notifications) {
//   notifications.forEach(function(notification) {
//     notification.close();
//   });
// });
//   console.log('[fmsw] notificationclick', e);
// });

/**
 * firebase notifications & browser Application SW "Push" test - trigger this event
 */
// self.addEventListener(
//   'push',
//   event => {
//     let message;
//     try {
//       message = event.data.json(); // must be an object
//     } catch (error) {
//       message = event.data;
//     }

//     console.log(`[fmsw] push message`, message);

//     if (message.type) {
//       switch (message.type) {
//         case 'init':
//           break;
//         case 'shutdown':
//           break;
//       }
//     }
//   },
//   false
// );

/**
 * sw info events
 */
// ['install', 'activate', 'message'].forEach(type => {
//   self.addEventListener(type, e => {
//     console.log('[sw]: ' + type, type == 'push' ? e : '');
//   });
// });

/**
 * init messaging on website command
 */
// onmessage = e => {
//   if (e.data.settings) {
//     const config = JSON.parse(e.data.settings);
//     firebase.initializeApp(config.firebase); // eslint-disable-line
//     const messaging = firebase.messaging(); // eslint-disable-line
