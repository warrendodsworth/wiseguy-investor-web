import { UserInfo } from 'firebase/app';

export class User implements UserInfo {
  providerId: string;

  uid: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  photoURL: string;

  website?: string;
  bio?: string;
  about: string;

  fcmTokens?: { [token: string]: true };
  roles: Roles;

  subscription: Subscription;
}

export class Roles {
  admin?: true | false = false;
  editor?: true | false = false;
  subscriber?: true | false = false;
  user = true;
}

// stripe
export class Subscription {
  type: string;
  token: string;
  status: string;
}
