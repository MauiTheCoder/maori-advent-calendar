/**
 * Environment Variable Validation for Firebase Configuration
 */

interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId?: string
}

export function validateFirebaseConfig(): FirebaseConfig {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
  }

  const missingVars: string[] = []
  
  if (!config.apiKey) missingVars.push('NEXT_PUBLIC_FIREBASE_API_KEY')
  if (!config.authDomain) missingVars.push('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN')
  if (!config.projectId) missingVars.push('NEXT_PUBLIC_FIREBASE_PROJECT_ID')
  if (!config.storageBucket) missingVars.push('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET')
  if (!config.messagingSenderId) missingVars.push('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID')
  if (!config.appId) missingVars.push('NEXT_PUBLIC_FIREBASE_APP_ID')

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required Firebase environment variables: ${missingVars.join(', ')}\n\n` +
      'Please create a .env.local file with your Firebase configuration. ' +
      'See .env.local.example for the required format.'
    )
  }

  return config as FirebaseConfig
}

export function getEnvironment(): 'development' | 'production' | 'test' {
  return (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development'
}

export function isDevelopment(): boolean {
  return getEnvironment() === 'development'
}

export function isProduction(): boolean {
  return getEnvironment() === 'production'
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
}

export function getAdminEmails(): string[] {
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS
  if (!adminEmails) return []
  
  return adminEmails.split(',').map(email => email.trim()).filter(Boolean)
}

export function isAdminEmail(email: string): boolean {
  const adminEmails = getAdminEmails()
  return adminEmails.includes(email.toLowerCase())
}

export function logEnvironmentStatus(): void {
  console.log('🔧 Environment Configuration:')
  console.log(`   Environment: ${getEnvironment()}`)
  console.log(`   Site URL: ${getSiteUrl()}`)
  console.log(`   Firebase Project: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`)
  console.log(`   Admin Emails: ${getAdminEmails().length} configured`)
  
  if (isDevelopment()) {
    console.log('⚠️  Development mode - some features may be limited')
  }
}