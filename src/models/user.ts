import * as firebase from 'firebase';

export class User implements firebase.UserInfo {
  providerId: string;

  uid: string;
  photoURL: string;
  displayName: string;
  email: string;
  phoneNumber: string;

  about: string;

  roles: Roles;

  fcmTokens?: { [token: string]: true };

  subscription: Subscription;
}

//stripe
export class Subscription {
  type: string;
  token: string;
  status: string;
}

export class Roles {
  subscriber?: boolean;
  editor?: boolean;
  admin?: boolean;
}
