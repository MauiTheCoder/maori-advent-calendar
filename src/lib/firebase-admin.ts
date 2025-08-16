import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Use environment variables for Firebase Admin
const adminConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // For Netlify, use service account key as environment variable
  credential: process.env.FIREBASE_SERVICE_ACCOUNT_KEY 
    ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY))
    : undefined
};

// Initialize admin app only if it doesn't exist
const adminApp = getApps().find(app => app.name === 'admin') || 
                 initializeApp(adminConfig, 'admin');

export const adminDb = getFirestore(adminApp);
export default adminApp;