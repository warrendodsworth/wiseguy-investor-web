const { db } = require('./main');

console.log('Running Groups');
addOrderToGroupResources();

async function addOrderToGroupResources() {
  const qutGid = 'rE42aU0GLqh3HP5UYbHI';
  const vupaGid = '4SoV2Vt3yE6iA3fg6YL1';

  const gs = await db.collection('resources').where('groupId', '==', vupaGid).get();
  let i = 0;

  const promises = [];

  gs.forEach(s => {
    promises.push(s.ref.update('order', i++));

    console.log(s.data().name, i);
  });

  await Promise.all(promises);
  // process.exit();
}
