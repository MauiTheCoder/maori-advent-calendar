'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuthContext } from '@/contexts/AuthContext'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'signin' | 'signup'
}

export default function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>(initialMode)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const { signIn, signUp, resetPassword } = useAuthContext()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match')
        }
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters')
        }
        
        const result = await signUp(formData.email, formData.password, formData.name)
        if (result.needsVerification) {
          setSuccess('Account created! Please check your email to verify your account.')
        } else {
          setSuccess('Account created successfully!')
          setTimeout(() => onClose(), 2000)
        }
      } else if (mode === 'signin') {
        await signIn(formData.email, formData.password)
        setSuccess('Signed in successfully!')
        setTimeout(() => onClose(), 1000)
      } else if (mode === 'reset') {
        await resetPassword(formData.email)
        setSuccess('Password reset email sent! Check your inbox.')
        setMode('signin')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    })
    setError('')
    setSuccess('')
  }

  const switchMode = (newMode: 'signin' | 'signup' | 'reset') => {
    setMode(newMode)
    resetForm()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md"
        >
          <Card>
            <CardHeader>
              <CardTitle>
                {mode === 'signin' && 'Sign In'}
                {mode === 'signup' && 'Create Account'}
                {mode === 'reset' && 'Reset Password'}
              </CardTitle>
              <CardDescription>
                {mode === 'signin' && 'Welcome back! Sign in to continue your journey.'}
                {mode === 'signup' && 'Join the Mahuru Challenge and start learning te reo Māori!'}
                {mode === 'reset' && 'Enter your email to receive a password reset link.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-600">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50">
                    <AlertDescription className="text-green-600">
                      {success}
                    </AlertDescription>
                  </Alert>
                )}

                {mode === 'signup' && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                  />
                </div>

                {mode !== 'reset' && (
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter your password"
                      autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                      required
                      minLength={6}
                    />
                  </div>
                )}

                {mode === 'signup' && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      required
                      minLength={6}
                    />
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                      <span>
                        {mode === 'signin' && 'Signing In...'}
                        {mode === 'signup' && 'Creating Account...'}
                        {mode === 'reset' && 'Sending Email...'}
                      </span>
                    </div>
                  ) : (
                    <>
                      {mode === 'signin' && 'Sign In'}
                      {mode === 'signup' && 'Create Account'}
                      {mode === 'reset' && 'Send Reset Email'}
                    </>
                  )}
                </Button>

                <div className="text-center space-y-2">
                  {mode === 'signin' && (
                    <>
                      <button
                        type="button"
                        onClick={() => switchMode('reset')}
                        className="text-sm text-muted-foreground hover:text-primary"
                      >
                        Forgot your password?
                      </button>
                      <div className="text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <button
                          type="button"
                          onClick={() => switchMode('signup')}
                          className="text-primary hover:underline"
                        >
                          Sign up here
                        </button>
                      </div>
                    </>
                  )}

                  {mode === 'signup' && (
                    <div className="text-sm text-muted-foreground">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => switchMode('signin')}
                        className="text-primary hover:underline"
                      >
                        Sign in here
                      </button>
                    </div>
                  )}

                  {mode === 'reset' && (
                    <div className="text-sm text-muted-foreground">
                      Remember your password?{' '}
                      <button
                        type="button"
                        onClick={() => switchMode('signin')}
                        className="text-primary hover:underline"
                      >
                        Sign in here
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}