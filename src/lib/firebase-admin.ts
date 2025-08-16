import admin from 'firebase-admin';

// Use environment variables for Firebase Admin
const adminConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // For Netlify, use service account key as environment variable
  credential: process.env.FIREBASE_SERVICE_ACCOUNT_KEY 
    ? admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY))
    : undefined
};

// Initialize admin app only if it doesn't exist
const adminApp = admin.apps.find((app) => app?.name === 'admin') || 
                 admin.initializeApp(adminConfig, 'admin');

export const adminDb = admin.firestore(adminApp);
export default adminApp;