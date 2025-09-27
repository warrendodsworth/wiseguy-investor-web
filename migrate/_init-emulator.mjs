import { app, db, auth } from './main.mjs';
import { UserService } from './services.mjs';

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';

await setupEmulatorData();
await initializeBlogPosts();

export async function setupEmulatorData() {
  const appConfig = {
    version: 1,
    id: 'wgi',
    title: 'WiseGuy Investor',
    photoURL: 'https://picsum.photos/100',
    description: 'Default app config',
    tagline: 'Welcome to WiseGuy Investor',
    pages: [
      { id: 'home', name: 'Home', icon: 'home', menuGroup: 'home' },
      { id: 'help', name: 'Help', icon: 'help', menuGroup: 'help' },
    ],
  };

  const result = await db.collection('apps').doc(appConfig.id).set(appConfig);
  console.log(`[EMULATOR] App config set: id=${appConfig.id} at ${result.writeTime.toDate()}`);

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
      console.log(`[EMULATOR] User created: uid=${userRecord.uid}, email=${email}`);
    } catch (err) {
      userRecord = await auth.getUserByEmail(email);
      console.log(`[EMULATOR] User create error: ${err}`);
      console.log(`[EMULATOR] User exists: uid=${userRecord.uid}, email=${email}`);
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
    console.log(`[EMULATOR] User added to DB: uid=${userRecord.uid}, email=${userRecord.email}`);
  }
}

// Utility function to initialize Firestore with a few blog posts
// Usage: Call this function from a script or Angular service with a Firestore instance
async function initializeBlogPosts() {
  // Fetch recently created users
  const usersSnap = await db.collection('users').get();
  const userIds = usersSnap.docs.map((doc) => doc.id);
  if (userIds.length === 0) {
    console.warn('[EMULATOR] No users found to assign as post creators.');
    return;
  }

  const posts = [
    {
      title: 'Welcome to WiseGuy Investor',
      text: 'This is your first post! Share your market insights and ideas.',
      category: 'General',
      tags: ['welcome', 'intro'],
      featured: true,
      draft: false,
      photoURL: 'https://picsum.photos/1080?1',
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
      likes: 0,
      hearted: false,
    },
  ];

  // Assign each post a createUid from the userIds, cycling if needed
  const postsCol = db.collection('posts');
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const creatorUid = userIds[i % userIds.length];
    post.createUid = creatorUid;
    post.createDate = db.constructor.Timestamp ? db.constructor.Timestamp.now() : new Date();
    await postsCol.add(post);
  }
  console.log(`[EMULATOR] Sample blog posts added to Firestore with user UIDs: [${userIds.join(', ')}]`);
}
