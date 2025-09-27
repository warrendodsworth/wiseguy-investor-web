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
