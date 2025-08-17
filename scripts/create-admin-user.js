const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

async function createAdminUser() {
  try {
    console.log('🔥 Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const userId = '1Y9jnntQr1acVxkQWXOWGOHAZVD2';
    console.log(`👤 Creating admin user for: ${userId}`);

    // Check if admin user already exists
    const adminDoc = await getDoc(doc(db, 'admin_users', userId));
    
    if (adminDoc.exists()) {
      console.log('✅ Admin user already exists');
      console.log('Current data:', adminDoc.data());
      return;
    }

    // Create admin user document
    const adminUserData = {
      uid: userId,
      email: 'leon.green@twoa.ac.nz', // From environment variables
      name: 'Leon Green',
      role: 'super_admin',
      permissions: {
        canEditContent: true,
        canEditLayout: true,
        canManageUsers: true,
        canManageMedia: true,
        canEditActivities: true,
        canViewAnalytics: true
      },
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      isActive: true
    };

    await setDoc(doc(db, 'admin_users', userId), adminUserData);
    console.log('✅ Admin user created successfully!');
    console.log('Admin data:', adminUserData);

    // Verify creation
    const verifyDoc = await getDoc(doc(db, 'admin_users', userId));
    if (verifyDoc.exists()) {
      console.log('✅ Verification successful - admin user exists in Firestore');
    } else {
      console.error('❌ Verification failed - admin user not found');
    }

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();