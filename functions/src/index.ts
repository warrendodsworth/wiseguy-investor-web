import { onCreateAccount, onCreateUser } from './app/accounts/user-create.fn';
import { onDeleteAccount } from './app/accounts/user-delete.fn';
import { updateClaims } from './app/accounts/user-update-claims.fn';
import { updateUserData } from './app/accounts/user-update.fn';
import { getCryptoData } from './app/finance/coinmarketcap.fn';
import { getNasdaqData } from './app/finance/nasdaq.fn';
import { subscribeToTopic, unsubscribeFromTopic, notifyTopic, notifyUser } from './app/notifs/notif.fn';
import './main';

module.exports.finance = {
  // finance
  getNasdaqData: getNasdaqData,
  // crypto
  getCryptoData: getCryptoData,
};

// users
module.exports.accounts = {
  onCreateAccount: onCreateAccount,
  onDeleteAccount: onDeleteAccount,
  onCreateUser: onCreateUser,
  updateClaims: updateClaims,
  updateUserData: updateUserData,
};

// notifs
module.exports.notifs = {
  subscribeToTopic: subscribeToTopic,
  unsubscribeFromTopic: unsubscribeFromTopic,
  notifyTopic: notifyTopic,
  notifyUser: notifyUser,
};
