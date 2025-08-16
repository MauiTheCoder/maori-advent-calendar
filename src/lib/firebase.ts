import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, enableNetwork } from 'firebase/firestore'
import { validateFirebaseConfig, logEnvironmentStatus, isDevelopment } from './env-validation'

// Get Firebase configuration with fallback
function getFirebaseConfig() {
  // Check if all required environment variables exist
  const hasRequiredEnvVars = !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET &&
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  )
  
  if (hasRequiredEnvVars) {
    try {
      return validateFirebaseConfig()
    } catch (error) {
      if (isDevelopment()) {
        console.warn('Environment validation failed, using fallback:', error)
      }
    }
  }
  
  // Fallback configuration - throw error instead of exposing credentials
  const errorMsg = 'Firebase configuration missing. Please set the required environment variables.'
  if (isDevelopment()) {
    console.error('❌ Firebase configuration missing:', {
      required: [
        'NEXT_PUBLIC_FIREBASE_API_KEY',
        'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
        'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
        'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
        'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
        'NEXT_PUBLIC_FIREBASE_APP_ID'
      ],
      provided: Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_FIREBASE_'))
    })
  }
  throw new Error(errorMsg)
}

const firebaseConfig = getFirebaseConfig()

// Log environment status in development
if (isDevelopment()) {
  logEnvironmentStatus()
}

// Initialize Firebase
if (isDevelopment()) {
  console.log('🔥 Initializing Firebase with config:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    environment: 'development'
  })
  
  // Debug potential quoting issues
  console.log('🔍 Project ID Debug:', {
    raw: firebaseConfig.projectId,
    type: typeof firebaseConfig.projectId,
    length: firebaseConfig.projectId?.length,
    hasQuotes: firebaseConfig.projectId?.includes('"'),
    charCodes: firebaseConfig.projectId?.split('').map(c => c.charCodeAt(0))
  })
}

const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)
if (isDevelopment()) {
  console.log('Firebase initialized successfully')
}

// Enable offline persistence and network
if (typeof window !== 'undefined') {
  // Only run on client side
  enableNetwork(db).catch(console.error)
}

export default app
