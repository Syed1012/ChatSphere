import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

// Resolve the path to the JSON file
const serviceAccountPath = path.resolve('./firebase-admin-sdk.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;