import { Style } from '@capacitor/status-bar';

import { DatePredicate } from '../services/base-firestore.service';
import { Entity } from './_entity';

export type ChatStatus = 'requested' | 'open' | 'closed';

export class AppUser extends Entity {
  displayName: string;
  email: string;
  photoURL: string;
  /** used to query multiple users by id's */
  uid: string;

  photoURLThumb: string;
  website?: string;
  bio?: string;

  isAnonymous: boolean;
  lastLoginDate: DatePredicate;
  lastActiveDate: DatePredicate;
  // notifs - fcm notification topics to subscribe to - not used for notifying people currently
  fcmTokens: string[] = [];
  topics: string[] = [];

  roles: Roles = {};
  theme: Style = Style.Light;

  // e.g. LM Plus - givng users access
  subscriptions = new Subscriptions();

  /**
   * USER
   */
  userJoinReason: string;
  interests: string;

  /** User: unread msg count */
  chatUnreadCount = 0;

  /** Map Chat Requests Made - uid: chatStatus 'requested' 'open' etc */
  chatRequestsMade: { [uid: string]: ChatStatus } = {};

  /**
   * PRIVACY
   */
  privacy: Privacy = new Privacy();

  /** MATE */
  birthday?: DatePredicate;

  /** random number for ordering users */
  randomizer: number;

  /** free-text address */
  address: string;

  // supportAreas: string[] = [];
  // mateActive = false;
  /** Mate: Chat requests received count - counted in cloud function */
  chatRequestCount = 0;
  // mate metadata - new Map - to be used
  // mate: MateData = new MateData();
  // mateJoin: MateJoin = new MateJoin();

  /**
   * META
   */
  // policeCheckDoc: FileData = {} as any; // file access restricted in storage.rules

  /**
   * GROUPS
   */
  currentGroupId: string;
  groups: { [groupId: string]: UserGroup } = {};
}

/** Visible to currentUser and admin */
export class UserPrivate extends Entity {
  email: string;
}

export class MateData {
  bookPracticeChatURL = '';
  bookInterviewURL?: string = '';

  joinReason?: string = '';
  availability?: string = '';
}

// Practice chat 20m, Mentor pretends to be a Member
// Mate closes Chat, updates status to practiceChatComplete automatically, toast to let them know
export class MateJoin {
  signedUp?: boolean = false; // if the user signs up as a Mate
  trainingStarted?: boolean = false;
  trainingComplete?: boolean = false;
  policeCheckComplete?: boolean = false;
  interviewComplete?: boolean = false;
  practiceChatComplete?: boolean = false;

  verificationIssue?: string;
}

class Privacy {
  userInterestsPublic = true;
  userJoinReasonPublic = true;
  wellbeingGraphPublic = true;
}

export class UserGroup {
  groupId: string;
  name: string; // used to display group name in lists

  // role: GroupMemberRole = 'user';
  // status: GroupMemberStatus = 'pending';
  // didn't add "currentGroup: true" here as there'd be maintainance work to make sure there was only one
  // private static createGroupUser(name: string, role = 'user', status = 'pending') {
  //   return { name, role, status } as UserGroup;
  // }
  // static admin(name: string) {
  //   return this.createGroupUser(name, 'admin', 'active');
  // }
  // static member(name: string) {
  //   return this.createGroupUser(name);
  // }
}

export class Roles {
  admin?: boolean = false;
  editor?: boolean = false;

  user?: boolean = true;
}

/**
 * Dummy class - filled in from Claims when User opens app in auth.store.ts
 */
export class Subscriptions {
  plus = false;
}

export interface UserLoginDetail {
  username: string;
  password: string;
}

export class EmailSignupModel {
  displayName: string;
  email: string;
  password: string;
}
