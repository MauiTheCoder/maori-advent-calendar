'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { mahuruActivities2025 } from '@/data/mahuru-activities'

export default function Activity() {
  const { isAuthenticated, user, profile, character, updateProfile, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const day = parseInt(params.day as string)

  const [activityCompleted, setActivityCompleted] = useState(false)
  const [startTime] = useState(Date.now())

  const isValidDay = !isNaN(day) && day >= 1 && day <= 30

  useEffect(() => {
    if (!isValidDay) return
    
    console.log('🎯 Mahuru Activity page state:', { 
      loading, 
      isAuthenticated, 
      profile: profile ? {
        character_id: profile.character_id,
        difficulty_level: profile.difficulty_level,
        completed_days: profile.completed_days?.length || 0
      } : null
    })

    if (loading) return

    if (!isAuthenticated || !user) {
      console.log('❌ Not authenticated, redirecting to home')
      router.push('/')
      return
    }

    if (!profile?.character_id) {
      console.log('❌ No character selected, redirecting to character selection')
      router.push('/character-selection')
      return
    }

    const completedDays = profile.completed_days || []
    if (completedDays.includes(day)) {
      setActivityCompleted(true)
    }
  }, [loading, isAuthenticated, router, profile, day, user, isValidDay])

  if (!isValidDay) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Invalid Day</h2>
          <p className="text-muted-foreground">Please select a valid day between 1 and 30.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg">Loading your te reo Māori journey...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !profile || !profile.character_id) {
    return null
  }

  const getMahuruActivity = (day: number) => {
    const activity = mahuruActivities2025.find(a => a.day === day)
    if (!activity) return null

    const difficulty = profile?.difficulty_level || 'beginner'
    
    let activityText = ''
    let difficultyLabel = ''
    let points = 10

    switch (difficulty) {
      case 'beginner':
        activityText = activity.beginner
        difficultyLabel = 'Beginner'
        points = 10
        break
      case 'intermediate':
        activityText = activity.intermediate
        difficultyLabel = 'Intermediate'
        points = 15
        break
      case 'advanced':
        activityText = activity.advanced
        difficultyLabel = 'Advanced'
        points = 20
        break
      default:
        activityText = activity.beginner
        difficultyLabel = 'Beginner'
        points = 10
    }

    return {
      day,
      text: activityText,
      difficulty: difficultyLabel,
      points
    }
  }

  const handleCompleteActivity = async () => {
    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000)
      const activity = getMahuruActivity(day)
      
      if (!activity) return

      const completedDays = profile.completed_days || []
      const newCompletedDays = [...completedDays, day]
      const newTotalPoints = (profile.total_points || 0) + activity.points

      await updateProfile({
        completed_days: newCompletedDays,
        total_points: newTotalPoints,
        last_activity_date: new Date().toISOString()
      })

      setActivityCompleted(true)
    } catch (error) {
      console.error('Error completing activity:', error)
    }
  }

  const activity = getMahuruActivity(day)
  
  if (!activity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Activity Not Found</h2>
          <p className="text-muted-foreground">This day's activity is not available.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10">
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>← Back to Dashboard</span>
            </button>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Day {day}
              </Badge>
              <Badge variant="outline" className="bg-accent/10 text-accent-foreground border-accent/20">
                {activity.difficulty}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="cultural-card">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto flex items-center justify-center mb-4">
                <span className="text-3xl">🌿</span>
              </div>
              <CardTitle className="text-3xl">
                Mahuru Day {day}
              </CardTitle>
              <CardDescription className="text-lg">
                {activity.difficulty} Level - {activity.points} Points
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-primary">Today's Te Reo Māori Challenge</h3>
                <p className="text-lg leading-relaxed">{activity.text}</p>
              </div>

              <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-accent-foreground">💡 Helpful Tips</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Take your time and practice at your own pace</li>
                  <li>• Use the Mahuru website resources for additional support</li>
                  <li>• Share your progress with whānau and friends</li>
                  <li>• Remember: kia kaha (be strong) in your learning journey!</li>
                </ul>
              </div>

              {activityCompleted ? (
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                    <span className="text-4xl">✅</span>
                  </div>
                  <h3 className="text-2xl font-bold text-green-600">Ka pai! Well done!</h3>
                  <p className="text-muted-foreground">
                    You've completed today's te reo Māori challenge and earned {activity.points} points!
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Button onClick={() => router.push('/dashboard')} variant="outline">
                      Return to Dashboard
                    </Button>
                    {day < 30 && (
                      <Button onClick={() => router.push(`/activity/${day + 1}`)}>
                        Next Day →
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <Button onClick={handleCompleteActivity} size="lg" className="w-full">
                    Mark as Complete
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Complete this activity when you've finished today's te reo Māori challenge
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Mahuru Activation 2025 • Te Wānanga o Aotearoa
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}