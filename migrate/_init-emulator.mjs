import { app, db, auth } from './main.mjs';
import { UserService } from './services.mjs';

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';

setupEmulatorData();
initializeBlogPosts();

export async function setupEmulatorData() {
  const appConfig = {
    version: 1,
    id: 'wgi',
    title: 'WiseGuyInvestor',
    photoURL: 'https://picsum.photos/100',
    description: 'Default Insight91 app config',
    theme: { name: 'blue' },
    tagline: 'Welcome to WiseGuyInvestor',
    pages: [
      { id: 'home', name: 'Home', icon: 'home', menuGroup: 'home' },
      { id: 'help', name: 'Help', icon: 'help', menuGroup: 'help' },
    ],
  };

  const result = await db.collection('apps').doc(appConfig.id).set(appConfig);
  console.log('App config set:', appConfig.id, result.writeTime.toDate());

  // Create two default users and add them to Firestore
  const userDetails = [
    {
      email: 'warren.dodsworth@gmail.com',
      password: 'test123',
      displayName: 'Warren Dodsworth',
      roles: { admin: true },
    },
    { email: 'significant33@gmail.com', password: 'test123', displayName: 'Daniel Jackson', roles: { user: true } },
  ];

  for (const { email, password, displayName, roles } of userDetails) {
    // Generate a Firestore document ID for the user
    const userDocRef = db.collection('users').doc();
    const generatedUid = userDocRef.id;

    // Create user in Firebase Auth emulator
    let userRecord;
    try {
      userRecord = await auth.createUser({ email, password, displayName, uid: generatedUid });
      if (roles) {
        await auth.setCustomUserClaims(userRecord.uid, roles);
      }
      console.log('User Created:', userRecord.uid, email);
    } catch (err) {
      userRecord = await auth.getUserByEmail(email);
      console.log(`User Create Error:`, err);
      console.log('User Exists:', userRecord.uid, email);
    }

    // Add user to Firestore users table
    const userData = {
      uid: userRecord.uid,
      displayName: userRecord.displayName,
      photoURL: 'https://picsum.photos/100',
      createdDate: db.constructor.Timestamp ? db.constructor.Timestamp.now() : new Date(),
      roles: roles,
    };
    await UserService.ref(userRecord.uid).set(userData);
    await db.collection('user_meta').doc(userRecord.uid).set({
      email: userRecord.email,
    });
    console.log('User Added to Db:', userRecord.uid, userRecord.email);
  }
}

// Utility function to initialize Firestore with a few blog posts
// Usage: Call this function from a script or Angular service with a Firestore instance
async function initializeBlogPosts() {
  const posts = [
    {
      title: 'Welcome to WiseGuy Investor',
      text: 'This is your first post! Share your market insights and ideas.',
      category: 'General',
      tags: ['welcome', 'intro'],
      featured: true,
      draft: false,
      photoURL: 'https://picsum.photos/1080?1',
      uid: 'admin',
      likes: 0,
      hearted: false,
    },
    {
      title: 'Market Trends 2025',
      text: 'A look at the key trends shaping the market this year.',
      category: 'Trends',
      tags: ['market', '2025'],
      featured: false,
      draft: false,
      photoURL: 'https://picsum.photos/1080?2',
      uid: 'user1',
      likes: 0,
      hearted: false,
    },
    {
      title: 'How to Analyze Stocks',
      text: 'A beginner-friendly guide to stock analysis.',
      category: 'Education',
      tags: ['stocks', 'analysis'],
      featured: false,
      draft: false,
      photoURL: 'https://picsum.photos/1080?3',
      uid: 'user2',
      likes: 0,
      hearted: false,
    },
  ];

  const postsCol = db.collection('posts');
  for (const post of posts) {
    post.createDate = db.constructor.Timestamp ? db.constructor.Timestamp.now() : new Date();
    await postsCol.add(post);
  }
  console.log('Sample blog posts added to Firestore.');
}
