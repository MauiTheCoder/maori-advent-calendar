'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { initializeAdminSystem, createFirstAdmin } from '@/lib/admin-seed'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { motion } from 'framer-motion'

export default function AdminSetup() {
  const router = useRouter()
  
  const [step, setStep] = useState<'initialize' | 'create_admin' | 'complete'>('initialize')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [adminData, setAdminData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  })

  const handleInitializeSystem = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await initializeAdminSystem()
      setSuccess('Admin system initialized successfully!')
      setStep('create_admin')
    } catch (error) {
      console.error('Initialization error:', error)
      setError('Failed to initialize admin system. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (!adminData.email || !adminData.password || !adminData.displayName) {
      setError('All fields are required')
      setLoading(false)
      return
    }

    if (adminData.password !== adminData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (adminData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        adminData.email, 
        adminData.password
      )

      // Create admin user in database
      await createFirstAdmin(adminData.email, userCredential.user.uid)

      setSuccess('First admin user created successfully!')
      setStep('complete')
    } catch (error: unknown) {
      console.error('Admin creation error:', error)
      
      const firebaseError = error as { code?: string; message?: string }
      if (firebaseError.code === 'auth/email-already-in-use') {
        setError('Email is already in use')
      } else if (firebaseError.code === 'auth/invalid-email') {
        setError('Invalid email address')
      } else if (firebaseError.code === 'auth/weak-password') {
        setError('Password is too weak')
      } else {
        setError('Failed to create admin user. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = () => {
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10">
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">🌿</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Mahuru Admin Setup</h1>
              <p className="text-sm text-muted-foreground">Initialize your content management system</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <Card className="cultural-card">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto flex items-center justify-center mb-4">
                <span className="text-2xl">
                  {step === 'initialize' ? '🔧' : step === 'create_admin' ? '👤' : '✅'}
                </span>
              </div>
              <CardTitle className="text-2xl">
                {step === 'initialize' && 'Initialize System'}
                {step === 'create_admin' && 'Create Admin User'}
                {step === 'complete' && 'Setup Complete'}
              </CardTitle>
              <CardDescription>
                {step === 'initialize' && 'Set up the Mahuru CMS database and content'}
                {step === 'create_admin' && 'Create your first admin user account'}
                {step === 'complete' && 'Your admin system is ready to use'}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {success && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <AlertDescription className="text-green-600">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-600">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {step === 'initialize' && (
                <div className="space-y-6">
                  <div className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground">
                      This will initialize your Mahuru CMS with:
                    </p>
                    <ul className="text-sm space-y-2 text-left">
                      <li>• 30 days of Mahuru activities</li>
                      <li>• Default content and settings</li>
                      <li>• Layout customization options</li>
                      <li>• Admin user management</li>
                    </ul>
                  </div>
                  
                  <Button
                    onClick={handleInitializeSystem}
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                        <span>Initializing...</span>
                      </div>
                    ) : (
                      'Initialize Admin System'
                    )}
                  </Button>
                </div>
              )}

              {step === 'create_admin' && (
                <form onSubmit={handleCreateAdmin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      type="text"
                      value={adminData.displayName}
                      onChange={(e) => setAdminData(prev => ({ ...prev, displayName: e.target.value }))}
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Admin Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={adminData.email}
                      onChange={(e) => setAdminData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="admin@twoa.ac.nz"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={adminData.password}
                      onChange={(e) => setAdminData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Create a strong password"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={adminData.confirmPassword}
                      onChange={(e) => setAdminData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm your password"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating Admin...</span>
                      </div>
                    ) : (
                      'Create Admin User'
                    )}
                  </Button>
                </form>
              )}

              {step === 'complete' && (
                <div className="space-y-6 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                    <span className="text-4xl">🎉</span>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">All Set!</h3>
                    <p className="text-muted-foreground">
                      Your Mahuru admin system is now ready. You can sign in and start customizing your platform.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button onClick={handleComplete} className="w-full">
                      Go to Admin Login
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <a href="/" target="_blank">
                        View Live Site ↗
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              Mahuru Activation 2025 • Te Wānanga o Aotearoa
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}