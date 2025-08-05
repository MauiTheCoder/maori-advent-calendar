'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { seedDatabase, needsSeeding, reseedWithKaitiaki } from '@/lib/firebase-seed'

export default function Home() {
  const { isAuthenticated, user, signUp, signIn, loading } = useAuth()
  const router = useRouter()

  const [formMode, setFormMode] = useState<'signin' | 'signup'>('signup')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [showVerificationMessage, setShowVerificationMessage] = useState(false)
  const [seeded, setSeeded] = useState(false)

  // Initialize Firebase backend and expose reseeding function
  useEffect(() => {
    console.log('🔥 Firebase backend initialized and ready!')
    console.log('🌿 Updated to 3 Kaitiaki guardians: Kiwi (Beginner), Pūkeko (Intermediate), Tui (Advanced)')
    console.log('🔄 To reseed with new guardians, run: window.reseedKaitiaki()')

    // Expose reseeding function to global scope for easy access
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).reseedKaitiaki = async () => {
      try {
        console.log('🔄 Starting reseed process...')
        await reseedWithKaitiaki()
        console.log('✅ Reseed completed! Refresh the page to see changes.')
      } catch (error) {
        console.error('❌ Reseed failed:', error)
      }
    }

    // Mark as ready for authentication testing
    setSeeded(true)
  }, [])

  useEffect(() => {
    if (isAuthenticated && user?.emailVerified) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setFormLoading(true)
    setShowVerificationMessage(false)

    try {
      if (formMode === 'signup') {
        // Validation
        if (!formData.name.trim()) {
          throw new Error('Name is required')
        }
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match')
        }
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters')
        }

        const result = await signUp(formData.email, formData.password, formData.name)
        if (result.needsVerification) {
          setShowVerificationMessage(true)
        }
      } else {
        await signIn(formData.email, formData.password)
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An error occurred'
      setFormError(message)
    } finally {
      setFormLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg">Loading...</span>
        </div>
      </div>
    )
  }

  // Show verification message if user needs to verify email
  if (isAuthenticated && !user?.emailVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10">
        <header className="border-b border-border/50 backdrop-blur-sm bg-background/80">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">🌿</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Rā Katoa</h1>
                  <p className="text-sm text-muted-foreground">Cultural Journey</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                Te Wānanga o Aotearoa
              </Badge>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto">
            <Card className="cultural-card">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto flex items-center justify-center mb-4">
                  <span className="text-2xl">📧</span>
                </div>
                <CardTitle className="text-2xl">Check Your Email</CardTitle>
                <CardDescription>
                  Please verify your email address to continue your cultural journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-md">
                  <p className="text-sm text-center">
                    We've sent a verification email to <strong>{user?.email}</strong>
                  </p>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Click the link in your email to verify your account and begin your Māori cultural adventure.
                </p>
                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => window.location.reload()}
                    className="w-full"
                  >
                    I've Verified My Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">🌿</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Rā Katoa</h1>
                <p className="text-sm text-muted-foreground">30-Day Cultural Journey</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              Te Wānanga o Aotearoa
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl lg:text-6xl font-bold leading-tight"
              >
                Kia Ora!
                <br />
                <span className="text-primary">Discover Māori Culture</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-muted-foreground leading-relaxed"
              >
                Embark on a 30-day horizontal journey through Aotearoa's rich cultural heritage.
                Learn te reo Māori, explore traditional stories, and connect with the spiritual
                wisdom of indigenous New Zealand.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-2 gap-4 text-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span>Interactive Cultural Activities</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span>Traditional Stories & Legends</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span>Te Reo Māori Language</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    <span>Cultural Guardian Guides</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    <span>Progress Tracking & Achievements</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    <span>Real-time Sync Across Devices</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Registration Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="cultural-card">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                  {formMode === 'signup' ? 'Begin Your Cultural Journey' : 'Welcome Back'}
                </CardTitle>
                <CardDescription>
                  {formMode === 'signup'
                    ? 'Create your account and choose your Māori guardian to start exploring'
                    : 'Sign in to continue your cultural adventure'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {showVerificationMessage ? (
                  <Alert className="border-primary/20 bg-primary/5">
                    <AlertDescription className="text-center">
                      Account created successfully! Please check your email and click the verification link to complete registration.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {formMode === 'signup' && (
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder={formMode === 'signup' ? 'Create a password (min 6 characters)' : 'Enter your password'}
                        required
                      />
                    </div>

                    {formMode === 'signup' && (
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm your password"
                          required
                        />
                      </div>
                    )}

                    {formError && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-600">
                          {formError}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={formLoading}
                    >
                      {formLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                          <span>{formMode === 'signup' ? 'Creating Account...' : 'Signing In...'}</span>
                        </div>
                      ) : (
                        formMode === 'signup' ? 'Start Cultural Journey' : 'Sign In'
                      )}
                    </Button>

                    <div className="text-center space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {formMode === 'signup'
                          ? 'Already have an account?'
                          : 'Need to create an account?'
                        }
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setFormMode(formMode === 'signup' ? 'signin' : 'signup')
                          setFormError('')
                          setFormData({ name: '', email: '', password: '', confirmPassword: '' })
                        }}
                      >
                        {formMode === 'signup' ? 'Sign In Instead' : 'Create New Account'}
                      </Button>

                      {formMode === 'signin' && (
                        <Link href="/auth/reset-password" className="text-sm text-primary hover:underline">
                          Forgot your password?
                        </Link>
                      )}
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Cultural Context */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center space-y-6"
        >
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4">Māori Cultural Learning Platform</h3>
            <p className="text-muted-foreground leading-relaxed">
              This authentic cultural journey is designed in partnership with Te Wānanga o Aotearoa.
              Experience the beauty of Māori traditions through interactive activities, traditional stories,
              and language learning that honors the rich heritage of Aotearoa New Zealand.
            </p>
            <div className="flex justify-center mt-8">
              <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
                🌿 Culturally Authentic • Real Firebase Backend • Email Verification
              </Badge>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
