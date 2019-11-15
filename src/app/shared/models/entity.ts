import * as firebase from 'firebase';


export class Entity {
  createDate: firebase.firestore.FieldValue | any = firebase.firestore.FieldValue.serverTimestamp();
  createUid: string;
  editDate: firebase.firestore.FieldValue | any;
  editUid: string;
}
