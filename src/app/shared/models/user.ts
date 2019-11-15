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
  subscriber?: boolean;
  editor?: boolean;
  admin?: boolean;
}

// stripe
export class Subscription {
  type: string;
  token: string;
  status: string;
}
