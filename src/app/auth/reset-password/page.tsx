'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ResetPassword() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await resetPassword(email)
      setSuccess(true)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An error occurred'
      setError(message)
    } finally {
      setLoading(false)
    }
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
                <p className="text-sm text-muted-foreground">Password Reset</p>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="cultural-card">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto flex items-center justify-center mb-4">
                  <span className="text-2xl">🔑</span>
                </div>
                <CardTitle className="text-2xl">Reset Your Password</CardTitle>
                <CardDescription>
                  Enter your email address and we'll send you a link to reset your password
                </CardDescription>
              </CardHeader>
              <CardContent>
                {success ? (
                  <div className="space-y-4">
                    <Alert className="border-primary/20 bg-primary/5">
                      <AlertDescription className="text-center">
                        Password reset email sent! Please check your inbox and follow the instructions to reset your password.
                      </AlertDescription>
                    </Alert>

                    <div className="text-center space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Didn't receive the email? Check your spam folder or try again.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSuccess(false)
                          setEmail('')
                        }}
                        className="w-full"
                      >
                        Send Another Reset Email
                      </Button>
                      <Link href="/">
                        <Button variant="ghost" className="w-full">
                          Return to Home
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                      />
                    </div>

                    {error && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-600">
                          {error}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading || !email.trim()}
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending Reset Email...</span>
                        </div>
                      ) : (
                        'Send Reset Email'
                      )}
                    </Button>

                    <div className="text-center space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Remember your password?
                      </p>
                      <Link href="/">
                        <Button variant="outline" className="w-full">
                          Back to Sign In
                        </Button>
                      </Link>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
