'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { User } from '@/lib/firebase-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { motion } from 'framer-motion'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  type: 'progress' | 'cultural' | 'completion' | 'special'
  requirement: number
  userProgress: number
  isUnlocked: boolean
  pointsReward: number
}

export default function Achievements() {
  const { isAuthenticated, profile, loading } = useAuth()
  const router = useRouter()
  const [achievements, setAchievements] = useState<Achievement[]>([])

  const generateAchievements = useCallback((userProfile: User) => {
    const currentDay = userProfile.current_day || 1
    const totalPoints = userProfile.total_points || 0
    const difficulty = userProfile.difficulty_level || 'beginner'

    const achievementList: Achievement[] = [
      // Progress Achievements
      {
        id: 'first_step',
        title: 'Kia Timata - First Steps',
        description: 'Complete your first cultural activity',
        icon: '👣',
        type: 'progress',
        requirement: 1,
        userProgress: Math.max(0, currentDay - 1),
        isUnlocked: currentDay > 1,
        pointsReward: 10
      },
      {
        id: 'week_one',
        title: 'Te Wiki Tuatahi - First Week',
        description: 'Complete 7 days of cultural learning',
        icon: '📅',
        type: 'progress',
        requirement: 7,
        userProgress: Math.max(0, currentDay - 1),
        isUnlocked: currentDay > 7,
        pointsReward: 50
      },
      {
        id: 'halfway',
        title: 'Waenga - Halfway Journey',
        description: 'Reach the midpoint of your cultural adventure',
        icon: '🌉',
        type: 'progress',
        requirement: 15,
        userProgress: Math.max(0, currentDay - 1),
        isUnlocked: currentDay > 15,
        pointsReward: 100
      },
      {
        id: 'final_stretch',
        title: 'Te Mutunga - Final Stretch',
        description: 'Complete 25 days of cultural exploration',
        icon: '🏔️',
        type: 'progress',
        requirement: 25,
        userProgress: Math.max(0, currentDay - 1),
        isUnlocked: currentDay > 25,
        pointsReward: 150
      },
      {
        id: 'journey_complete',
        title: 'Rā Katoa - Complete Journey',
        description: 'Complete all 30 days of cultural adventure',
        icon: '🎯',
        type: 'completion',
        requirement: 30,
        userProgress: Math.max(0, currentDay - 1),
        isUnlocked: currentDay > 30,
        pointsReward: 300
      },

      // Cultural Achievements
      {
        id: 'first_greeting',
        title: 'Kia Ora Warrior',
        description: 'Master the art of Māori greetings',
        icon: '🤝',
        type: 'cultural',
        requirement: 3,
        userProgress: Math.min(3, Math.max(0, currentDay - 1)),
        isUnlocked: currentDay > 3,
        pointsReward: 25
      },
      {
        id: 'language_learner',
        title: 'Tumu Te Reo - Language Foundation',
        description: 'Learn basic Māori vocabulary and phrases',
        icon: '🗣️',
        type: 'cultural',
        requirement: 10,
        userProgress: Math.min(10, Math.max(0, currentDay - 1)),
        isUnlocked: currentDay > 10,
        pointsReward: 75
      },
      {
        id: 'story_keeper',
        title: 'Kaitiaki Kōrero - Story Keeper',
        description: 'Learn traditional Māori stories and legends',
        icon: '📖',
        type: 'cultural',
        requirement: 20,
        userProgress: Math.min(20, Math.max(0, currentDay - 1)),
        isUnlocked: currentDay > 20,
        pointsReward: 125
      },

      // Points Achievements
      {
        id: 'points_100',
        title: 'Pounga Centum - First Century',
        description: 'Earn your first 100 cultural points',
        icon: '💯',
        type: 'special',
        requirement: 100,
        userProgress: totalPoints,
        isUnlocked: totalPoints >= 100,
        pointsReward: 20
      },
      {
        id: 'points_500',
        title: 'Māori Scholar',
        description: 'Accumulate 500 cultural knowledge points',
        icon: '🎓',
        type: 'special',
        requirement: 500,
        userProgress: totalPoints,
        isUnlocked: totalPoints >= 500,
        pointsReward: 100
      },

      // Difficulty Achievements
      {
        id: 'difficulty_master',
        title: getDifficultyTitle(difficulty),
        description: `Complete journey at ${difficulty} level`,
        icon: getDifficultyIcon(difficulty),
        type: 'special',
        requirement: 30,
        userProgress: Math.max(0, currentDay - 1),
        isUnlocked: currentDay > 30,
        pointsReward: getDifficultyReward(difficulty)
      }
    ]

    setAchievements(achievementList)
  }, [])

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/')
      return
    }

    if (profile) {
      generateAchievements(profile)
    }
  }, [isAuthenticated, loading, profile, router, generateAchievements])

  const getDifficultyTitle = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Kaiako - Teacher Spirit'
      case 'intermediate': return 'Ākonga - Dedicated Learner'
      case 'advanced': return 'Pouako - Master Guide'
      default: return 'Cultural Explorer'
    }
  }

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '🌱'
      case 'intermediate': return '🌿'
      case 'advanced': return '🌳'
      default: return '⭐'
    }
  }

  const getDifficultyReward = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 200
      case 'intermediate': return 400
      case 'advanced': return 600
      default: return 200
    }
  }

  const getAchievementProgress = (achievement: Achievement) => {
    return Math.min(100, (achievement.userProgress / achievement.requirement) * 100)
  }

  const getAchievementTypeColor = (type: string) => {
    switch (type) {
      case 'progress': return 'bg-blue-500'
      case 'cultural': return 'bg-green-500'
      case 'completion': return 'bg-purple-500'
      case 'special': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg">Loading your achievements...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !profile) {
    return null
  }

  const unlockedAchievements = achievements.filter(a => a.isUnlocked)
  const lockedAchievements = achievements.filter(a => !a.isUnlocked)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/dashboard')}
              >
                ← Dashboard
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground text-sm">🏆</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold">Achievements</h1>
                  <p className="text-xs text-muted-foreground">
                    {unlockedAchievements.length} of {achievements.length} unlocked
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-primary text-primary-foreground text-xs">
                Day {profile.current_day}/30
              </Badge>
              <Badge variant="outline" className="text-xs">
                {profile.total_points} pts
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="cultural-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{unlockedAchievements.length}</CardTitle>
              <CardDescription>Achievements Unlocked</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cultural-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{Math.max(0, profile.current_day - 1)}</CardTitle>
              <CardDescription>Days Completed</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cultural-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{profile.total_points}</CardTitle>
              <CardDescription>Cultural Points Earned</CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-6">🎉 Achievements Unlocked</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unlockedAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="cultural-card border-primary/50 bg-primary/5">
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto flex items-center justify-center mb-3">
                        <span className="text-2xl">{achievement.icon}</span>
                      </div>
                      <CardTitle className="text-lg">{achievement.title}</CardTitle>
                      <CardDescription>{achievement.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <Badge className={`${getAchievementTypeColor(achievement.type)} text-white`}>
                        +{achievement.pointsReward} points
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Progress Achievements */}
        {lockedAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-6">🎯 In Progress</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lockedAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="cultural-card">
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center mb-3 opacity-60">
                        <span className="text-2xl">{achievement.icon}</span>
                      </div>
                      <CardTitle className="text-lg text-muted-foreground">
                        {achievement.title}
                      </CardTitle>
                      <CardDescription>{achievement.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{achievement.userProgress}/{achievement.requirement}</span>
                        </div>
                        <Progress
                          value={getAchievementProgress(achievement)}
                          className="h-2"
                        />
                      </div>
                      <div className="text-center">
                        <Badge variant="outline">
                          +{achievement.pointsReward} points
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
