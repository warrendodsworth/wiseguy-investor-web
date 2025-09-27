import { auth, db } from './main.mjs';

console.log('Initializing admin users...');
initAdmins();

// Add admin role to some Users
async function initAdmins() {
  const emails = ['warren.dodsworth@gmail.com'];

  for (const email of emails) {
    try {
      const user = await auth.getUserByEmail(email);

      if (!user.customClaims?.admin) {
        await auth.setCustomUserClaims(user.uid, { admin: true });
        await db.doc('users/' + user.uid).update({ 'roles.admin': true });
        console.log(`User added to admin role: ${user.uid} ${user.email} ${user.displayName}`, user.customClaims);
      }
    } catch (error) {
      console.log(`Error:`, error);
    }
  }
}
