import { FieldValue } from '@google-cloud/firestore';
import admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { environment } from '../../environments/environment';
import { db } from '../../main';
import { getBadge, processTokens, sendMulticast } from '../notifs/notif-send.util';
import { subscribeToTopics, unsubscribeFromTopics } from '../notifs/notif-subscribe.util';
import { UserInfo, UserService } from '../shared/user.model';
import { Group, GroupService } from './group.model';

const topicAdmins = (groupId: string) => `/topics/groups-${groupId}-admins`;

export const onCreateMember = functions.firestore.document('groups/{groupId}/members/{uid}').onCreate(async (snap, ctx) => {
  const promises: Promise<any>[] = [];
  const groupId = ctx.params.groupId;
  const uid = ctx.params.uid;

  const groupRef = GroupService.oneRef(groupId);
  const group = await GroupService.one(groupId);

  const userRef = UserService.userRef(uid);
  const user = await UserService.getUser(uid);
  const member = snap.data();

  // update user
  const b = db.batch();
  const userData: any = {
    [`groups.${groupId}`]: { name: group?.name || '', role: member.role || '', status: member.status, groupId: groupId },
  };

  // update group
  const groupData: any = {};
  if (member.status == 'active') {
    // admin added members
    userData.currentGroupId = groupId;
    groupData.memberCount = FieldValue.increment(1);
  } else if (member.status == 'pending') {
    groupData.joinRequestCount = FieldValue.increment(1);

    // notify admins - todo shift to notify group admins topic
    const admins = await db.collection(`groups/${groupId}/members`).where('role', '==', 'admin').get();
    admins.forEach(async (s) => {
      const user = await UserService.getUser(s.id);
      notifyAdminOfJoinRequest(user, group, member.name);
    });
  }

  if (member.role == 'admin') {
    // @deprecated admins on parent doc
    // groupData.admins = FieldValue.arrayUnion(uid);

    // subscribe admins to topic
    const adminTopic = topicAdmins(groupId);
    promises.push(subscribeToTopics(user.fcmTokens, adminTopic));
    userData.topics = FieldValue.arrayUnion(adminTopic);
  }
  b.update(groupRef, groupData);
  b.update(userRef, userData);

  return Promise.all([...promises, b.commit()]);
});

export const onUpdateMember = functions.firestore.document('groups/{groupId}/members/{uid}').onUpdate(async (change, ctx) => {
  const promises: Promise<any>[] = [];
  const groupId = ctx.params.groupId;
  const uid = ctx.params.uid;

  const memberBefore = change.before.data();
  const memberAfter = change.after.data();
  const groupRef = GroupService.oneRef(groupId);
  const userRef = UserService.userRef(uid);
  const user = (await UserService.getUser(uid)) as UserInfo;
  const group = await GroupService.one(groupId);
  const b = db.batch();

  const userData: any = {
    [`groups.${groupId}.name`]: group.name, // shouldn't be needed, only from groupUpdate
    [`groups.${groupId}.role`]: memberAfter.role,
    [`groups.${groupId}.status`]: memberAfter.status,
    [`groups.${groupId}.groupId`]: groupId,
  };

  let groupData: any = {};
  if (memberBefore.status == 'pending' && memberAfter.status == 'active') {
    // request accepted - notify user
    notifyFromUserJoinRequestAccepted(user, group);

    // update user's current group after Join Request approved
    userData.currentGroupId = groupId;

    groupData = {
      memberCount: FieldValue.increment(1),
      joinRequestCount: FieldValue.increment(-1),
    };
  } else if (memberBefore.status == 'active' && memberAfter.status == 'pending') {
    userData.currentGroupId = FieldValue.delete();

    groupData = {
      memberCount: FieldValue.increment(-1),
      joinRequestCount: FieldValue.increment(1),
    };
  }

  // subscribe admins to topic
  const adminTopic = topicAdmins(groupId);

  if (memberBefore.role == 'admin' && memberAfter.role != 'admin') {
    const user = await UserService.getUser(uid);
    promises.push(...unsubscribeFromTopics(user?.fcmTokens, adminTopic));
    userData.topics = FieldValue.arrayRemove(adminTopic);

    // @deprecated update admins on parent doc if there's a change in the member's role
    // groupData.admins = FieldValue.arrayRemove(uid);
  } else if (memberBefore.role != 'admin' && memberAfter.role == 'admin') {
    const user = await UserService.getUser(uid);
    promises.push(subscribeToTopics(user?.fcmTokens, adminTopic));
    userData.topics = FieldValue.arrayUnion(adminTopic);

    // @deprecated update admins on parent doc if there's a change in the member's role
    // groupData.admins = FieldValue.arrayUnion(uid);
  }

  b.update(userRef, userData);
  if (Object.keys(groupData).length > 0) {
    b.update(groupRef, groupData);
  }
  return Promise.all([...promises, b.commit()]);
});

export const onDeleteMember = functions.firestore.document('groups/{groupId}/members/{uid}').onDelete(async (snap, ctx) => {
  const promises: Promise<any>[] = [];
  const groupId = ctx.params.groupId;
  const uid = ctx.params.uid;

  const groupRef = GroupService.oneRef(groupId);
  const userRef = UserService.userRef(uid);
  const member = snap.data();
  const b = db.batch();

  const groupSnap = await groupRef.get(); // !bad hack - would read the group on each delete
  const groupData: any = {};

  if (groupSnap.exists) {
    // remove admin on parent doc
    if (member.role == 'admin') {
      // groupData.admins = FieldValue.arrayRemove(snap.id);
    }
    if (member.status == 'pending') {
      groupData.joinRequestCount = FieldValue.increment(-1);
    }
    if (member.status == 'active') {
      groupData.memberCount = FieldValue.increment(-1);
    }
    b.update(groupRef, groupData);
  }

  const userData = {
    [`groups.${groupId}`]: FieldValue.delete(),
    currentGroupId: FieldValue.delete(),
  };

  if (member.role == 'admin') {
    // unsubscribe admin from topics
    const user = await UserService.getUser(uid);
    const adminTopic = topicAdmins(groupId);
    promises.push(...unsubscribeFromTopics(user?.fcmTokens, adminTopic));
    userData.topics = FieldValue.arrayRemove(adminTopic);
  }
  b.update(userRef, userData);

  return Promise.all([...promises, b.commit()]);
});

// NOTIFS

export const notifyAdminOfJoinRequest = (admin: UserInfo, group?: Group, fromFirstName?: string): Promise<any> => {
  const msg: admin.messaging.MulticastMessage = {
    tokens: processTokens(admin.fcmTokens),
    notification: { title: `Your Group ${group?.name} has a new Join Request ` },
    apns: { payload: { aps: { badge: getBadge(admin) } } }, // does it need to update and decrement badges hmm
    webpush: {
      fcmOptions: { link: environment.rootURL + '/groups/' + group?.id + '/users/requests' },
      notification: { icon: environment.iconURL },
    },
  };
  return sendMulticast(msg);
};

export const notifyFromUserJoinRequestAccepted = (user: UserInfo, group: Group): Promise<any> => {
  const msg: admin.messaging.MulticastMessage = {
    tokens: processTokens(user.fcmTokens),
    notification: { title: `Join Request Accepted`, body: `Your Request to Join the Group ${group?.name} has been Accepted!` },
    apns: { payload: { aps: { badge: getBadge(user) } } }, // does it need to update and decrement badges hmm
    webpush: {
      fcmOptions: { link: environment.rootURL + '/app/tabs/accounts/' + user?.uid + '/membership' },
      notification: { icon: environment.iconURL },
    },
  };
  return sendMulticast(msg);
};
