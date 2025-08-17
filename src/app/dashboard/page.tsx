'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const { isAuthenticated, profile, character, loading, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const needsCharacterSelection = !profile?.character_id

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/')
      return
    }
  }, [loading, isAuthenticated, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded-full animate-spin bg-primary"></div>
          <span className="text-lg">Loading your cultural journey...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10">
      {/* Header */}
      <header className="backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">🌿</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Rā Katoa</h1>
                <p className="text-sm text-muted-foreground">
                  Kia ora, {profile.name}!
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-primary text-primary-foreground">
                Day {profile.current_day}
              </Badge>
              <Badge variant="outline">
                {profile.total_points} points
              </Badge>
              {profile.difficulty_level && (
                <Badge variant="secondary" className="capitalize">
                  {profile.difficulty_level}
                </Badge>
              )}
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {needsCharacterSelection ? (
          // Character Selection Flow
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="cultural-card">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">Choose Your Cultural Guardian</CardTitle>
                <CardDescription className="text-lg">
                  Select a Māori figure or animal to guide you through your cultural journey.
                  Each guardian has their own wisdom and cultural significance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Button
                    size="lg"
                    onClick={() => router.push('/character-selection')}
                  >
                    Choose Your Guardian
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          // Main Dashboard
          <div className="space-y-8">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <h2 className="text-4xl font-bold">
                Welcome to your cultural journey!
              </h2>
              {character && (
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🦅</span>
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-semibold">{character.name}</p>
                    <p className="text-muted-foreground">Your Cultural Guardian</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Progress Overview */}
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="cultural-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span>📅</span>
                      <span>Current Day</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">
                      {profile.current_day} / 30
                    </div>
                    <p className="text-muted-foreground">
                      {30 - profile.current_day} days remaining
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="cultural-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span>⭐</span>
                      <span>Total Points</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-accent">
                      {profile.total_points}
                    </div>
                    <p className="text-muted-foreground">
                      Cultural knowledge points
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card
                  className="cultural-card cursor-pointer hover:shadow-lg transition-all duration-300"
                  onClick={() => router.push('/achievements')}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span>🏆</span>
                      <span>Achievements</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">
                      {profile.achievements?.length || 0}
                    </div>
                    <p className="text-muted-foreground">
                      Cultural milestones unlocked
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Today's Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="cultural-card">
                <CardHeader>
                  <CardTitle className="text-2xl">Today's Cultural Activity</CardTitle>
                  <CardDescription>
                    Continue your journey through Māori culture
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-8 space-y-4">
                    <p className="text-muted-foreground mb-4">
                      Ready to explore Day {profile.current_day}?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        size="lg"
                        onClick={() => router.push('/journey')}
                        className="px-8"
                      >
                        🛤️ Explore Cultural Trail
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => router.push(`/activity/${profile.current_day}`)}
                      >
                        🌟 Today's Activity
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Scroll horizontally through your 30-day cultural journey
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
