import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getMessaging } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-sw.js';

initializeApp({
  messagingSenderId: '255140973105',
});

const messaging = getMessaging(firebaseApp);
