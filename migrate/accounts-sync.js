const { app, auth, db, messaging, adminsProd, printUser } = require('./main');

const admin = require('firebase-admin');
const { FieldValue } = require('@google-cloud/firestore');
const { DateTime } = require('luxon');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// const storage = app.storage();

console.log('Running Auth');
syncToFlodesk();

async function syncToFlodesk() {
  const promises = [];
  const authUsers = await auth.listUsers();

  authUsers.users.forEach(async (ur, i) => {
    const u = ur;

    if (u.email && i < 1) {
      const zapWebhookUrl = 'https://hooks.zapier.com/hooks/catch/10596572/bmy1uf1';
      const data = { firstName: u.displayName?.split(' ')[0], email: u.email };

      // axios.post(zapWebhookUrl, data, { headers: { 'Content-Type': 'application/json' } });
    }
  });

  console.log('Zap reqs', promises.length);
}
