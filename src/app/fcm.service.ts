import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Subject } from 'rxjs';

//_____PWA -  https://angularfirebase.com/lessons/push-messages-with-firestore/
@Injectable()
export class FcmService {
  private messaging = firebase.messaging()
  private messageSource = new Subject()
  currentMessage = this.messageSource.asObservable() // message observable to show in Angular component

  constructor(public afDb: AngularFirestore) { }

  testNotifyMe(uid) {
    this.afDb.collection('subscribers').add({
      userId: uid,
      subscriberId: uid + '1'
    })

    let n = {
      "collapse_key": "do_not_collapse",
      "from": "418827577592",
      "notification": {
        "title": "New Subscriber",
        "body": "JnrfPZIbXvcU3QjVfywidjZlBZJ31 is following your content!",
        "icon": "https://skaoss.blob.core.windows.net/brand/icon512.png"
      }
    }
  }

  getPermission(user) {
    this.messaging.requestPermission()
      .then(() => {
        console.log('[fcm] notification permission granted.')
        return this.messaging.getToken()
      })
      .then(token => {
        console.log('[fcm] pwa token saved', token.substring(0, 5))
        this.saveToken(user, token)
      })
      .catch((err) => {
        console.log('Unable to get permission to notify.', err)
      })
  }
  receiveMessages() {
    this.messaging.onMessage((payload) => {
      console.log("Message received", payload)
      this.messageSource.next(payload)
    })
  }
  private saveToken(user, token): void {

    const currentTokens = user.fcmTokens || {}

    // If token does not exist in firestore, update db
    if (!currentTokens[token]) {
      const userRef = this.afDb.collection('users').doc(user.uid)
      const tokens = { ...currentTokens, [token]: true }
      userRef.update({ fcmTokens: tokens })

      console.log('[fcm] token saved', token.substring(0, 5))
    }
  }
  monitorRefresh(user) {
    this.messaging.onTokenRefresh(() => {
      this.messaging.getToken()
        .then(refreshedToken => {
          console.log('Token refreshed.');
          this.saveToken(user, refreshedToken)
        })
        .catch(err => console.log(err, 'Unable to retrieve new token'))
    });
  }
}

// async getToken() {
//   let app = !document.URL.startsWith('http')
//   if (!app) {
//     navigator.serviceWorker.register('firebase-messaging-sw.js')
//       .then((registration) => {
//         this.messaging.useServiceWorker(registration)
//         this.getPermission()
//         this.receiveMessages()
//         console.log('service worker installed')
//       })
//   }
// }

// saveNotification(data) {
//   const notifyRef = firebase.database().ref('notifications/' + this.auth.identity.id)

//   notifyRef.orderByKey().limitToLast(1).once('value', (snap) => {
//     const last = snap.val()[0]

//     if (last == null || (last && last.title != data.title)) { //&& o.body != data.body
//       data.timestamp = firebase.database.ServerValue.TIMESTAMP;
//       notifyRef.push(data);
//     }
//   })
// }

