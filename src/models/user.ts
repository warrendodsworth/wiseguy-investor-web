import * as firebase from 'firebase';

export class User implements firebase.UserInfo {
  providerId: string;

  uid: string;
  photoURL: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  about: string;

  fcmTokens?: { [token: string]: true };

  roles: Roles;

  subscription: Subscription;
}

export class Roles {
  subscriber?: boolean;
  editor?: boolean;
  admin?: boolean;
}

//stripe
export class Subscription {
  type: string;
  token: string;
  status: string;
}

