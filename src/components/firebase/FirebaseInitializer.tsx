'use client'

import { useEffect, useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function FirebaseInitializer() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        setLoading(true)
        setError(null)

        // Check if Firebase environment variables are configured
        const requiredEnvVars = [
          'NEXT_PUBLIC_FIREBASE_API_KEY',
          'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
          'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
          'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
          'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
          'NEXT_PUBLIC_FIREBASE_APP_ID'
        ]

        const missingVars = requiredEnvVars.filter(
          varName => !process.env[varName]
        )

        if (missingVars.length > 0) {
          throw new Error(
            `Missing Firebase environment variables: ${missingVars.join(', ')}`
          )
        }

        // Initialize database seeding if needed
        const { needsSeeding } = await import('@/lib/firebase-seed')
        const shouldSeed = await needsSeeding()

        if (shouldSeed) {
          console.log('🌱 Database needs seeding, initializing...')
          const { seedDatabase } = await import('@/lib/firebase-seed')
          await seedDatabase()
          console.log('✅ Database seeded successfully')
        }

        // Initialize admin system
        const { initializeAdminSystem } = await import('@/lib/admin-seed')
        await initializeAdminSystem()
        console.log('✅ Admin system initialized')

        setIsInitialized(true)
        console.log('🚀 Firebase initialization complete')
      } catch (err) {
        console.error('❌ Firebase initialization failed:', err)
        setError(err instanceof Error ? err.message : 'Failed to initialize Firebase')
      } finally {
        setLoading(false)
      }
    }

    initializeFirebase()
  }, [])

  if (loading) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Alert className="w-80">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <AlertDescription>
              Initializing Firebase services...
            </AlertDescription>
          </div>
        </Alert>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Alert className="w-80 border-red-200 bg-red-50">
          <AlertDescription className="text-red-600">
            <strong>Firebase Error:</strong> {error}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (isInitialized) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Alert className="w-80 border-green-200 bg-green-50">
          <AlertDescription className="text-green-600">
            ✅ Firebase services ready
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return null
}