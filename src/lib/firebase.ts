import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator, enableNetwork } from 'firebase/firestore'
import { validateFirebaseConfig, logEnvironmentStatus, isDevelopment } from './env-validation'

// Get Firebase configuration with fallback
function getFirebaseConfig() {
  // Try to get from environment variables first
  if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    try {
      return validateFirebaseConfig()
    } catch (error) {
      console.warn('Environment validation failed:', error)
    }
  }
  
  // Fallback configuration for production
  console.warn('⚠️ Using hardcoded Firebase configuration as fallback')
  return {
    apiKey: "AIzaSyBp2XYYHYqTc9JykhiTdhmLywGTdFQPhhc",
    authDomain: "mahuru-maori-2025.firebaseapp.com",
    projectId: "mahuru-maori-2025",
    storageBucket: "mahuru-maori-2025.firebasestorage.app",
    messagingSenderId: "608916020621",
    appId: "1:608916020621:web:f5671e3d57a838a49c71c4",
    measurementId: "G-NJN363BV69"
  }
}

const firebaseConfig = getFirebaseConfig()

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
