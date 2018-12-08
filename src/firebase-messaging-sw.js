importScripts('https://www.gstatic.com/firebasejs/4.8.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.0/firebase-messaging.js');


firebase.initializeApp({
  'messagingSenderId': '255140973105'
});

const messaging = firebase.messaging();