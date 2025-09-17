const { DateTime } = require('luxon');
const { FieldValue } = require('@google-cloud/firestore');
const { app, auth, db, messaging } = require('./main.mjs').default;

const twoWeeksAgo = DateTime.now().minus({ weeks: 2 });

renameMoodInDb();

async function renameMoodInDb() {
  const colSnap = await db.collection('wellbeing').where('moodScoreReason', '==', 'Lonley').get();

  colSnap.forEach(async (s) => {
    const c = s.data();
    console.log(s.id, c.moodScoreReason);
    s.ref.update('moodScoreReason', 'Lonely');
  });
}
