// Load Firebase scripts using importScripts (UMD builds)
importScripts('https://www.gstatic.com/firebasejs/11.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.8.0/firebase-messaging-compat.js');

// Initialize Firebase app in the service worker
firebase.initializeApp({
  messagingSenderId: '255140973105',
  projectId: 'wiseguyapp',
  apiKey: 'AIzaSyCar7ZgSXx3bIO1rMycjZhe7UjwGewCXbE',
  appId: '1:423044829241:web:d3b002d490262564bf7de8',

  // Optionally add apiKey, projectId, etc. if needed
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here if needed
});
