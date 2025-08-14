import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator, enableNetwork } from 'firebase/firestore'
import { validateFirebaseConfig, logEnvironmentStatus, isDevelopment } from './env-validation'

// Validate and get Firebase configuration
const firebaseConfig = validateFirebaseConfig()

// Log environment status in development
if (isDevelopment()) {
  logEnvironmentStatus()
}

// Initialize Firebase
console.log('🔥 Initializing Firebase with config:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  environment: isDevelopment() ? 'development' : 'production'
})

const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)
console.log('Firebase initialized successfully')

// Enable offline persistence and network
if (typeof window !== 'undefined') {
  // Only run on client side
  enableNetwork(db).catch(console.error)
}

export default app
