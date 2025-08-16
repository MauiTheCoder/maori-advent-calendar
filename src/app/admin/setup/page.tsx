'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/contexts/AuthContext'
import { useAdminContext } from '@/contexts/AdminContext'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { isAdminEmail } from '@/lib/env-validation'

export default function AdminSetup() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const { signUp, isAuthenticated } = useAuthContext()
  const { isAdmin, createAdminUser } = useAdminContext()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      router.push('/admin/dashboard')
    }
  }, [isAuthenticated, isAdmin, router])

  const handleInitializeSystem = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Initialize admin system
      const { initializeAdminSystem } = await import('@/lib/admin-seed')
      await initializeAdminSystem()
      
      setSuccess('System initialized successfully!')
      setTimeout(() => {
        setStep(2)
        setSuccess('')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize system')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Validate form
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match')
      }
      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }
      if (!isAdminEmail(formData.email)) {
        throw new Error('Email is not authorized for admin access')
      }

      // Create user account
      const result = await signUp(formData.email, formData.password, formData.name)
      
      if (result.user) {
        // Create admin user record
        await createAdminUser({
          email: formData.email,
          displayName: formData.name,
          role: 'super_admin',
          permissions: {
            canEditContent: true,
            canEditLayout: true,
            canManageUsers: true,
            canManageMedia: true,
            canEditActivities: true,
            canViewAnalytics: true
          },
          lastLogin: new Date().toISOString()
        }, result.user.uid)

        setSuccess('Admin account created successfully!')
        setTimeout(() => {
          setStep(3)
          setSuccess('')
        }, 2000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create admin account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto flex items-center justify-center mb-4">
            <span className="text-2xl">🌿</span>
          </div>
          <CardTitle className="text-2xl">Mahuru Admin Setup</CardTitle>
          <CardDescription>Step {step} of 3</CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertDescription className="text-red-600">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <AlertDescription className="text-green-600">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Initialize System</h3>
                <p className="text-muted-foreground mb-4">
                  Set up your admin database and content management system.
                </p>
              </div>
              <Button 
                onClick={handleInitializeSystem}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Initializing...' : 'Initialize Database'}
              </Button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Create Admin User</h3>
                <p className="text-muted-foreground mb-4">
                  Create your admin account to manage the platform.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm password"
                  required
                  minLength={6}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Creating...' : 'Create Admin Account'}
              </Button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                <span className="text-4xl">✅</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Setup Complete!</h3>
                <p className="text-muted-foreground mt-2">
                  Your admin system is ready. You can now manage content and settings.
                </p>
              </div>
              <Button 
                onClick={() => router.push('/admin/dashboard')}
                className="w-full"
              >
                Go to Admin Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}