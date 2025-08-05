'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

interface DifficultyLevel {
  id: 'beginner' | 'intermediate' | 'advanced'
  title: string
  description: string
  features: string[]
  icon: string
  pointsMultiplier: number
  estimatedTime: string
}

export default function DifficultySelection() {
  const { profile, updateProfile, character } = useAuth()
  const router = useRouter()
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const difficultyLevels: DifficultyLevel[] = [
    {
      id: 'beginner',
      title: 'Kaiako (Beginner)',
      description: 'Perfect for those new to Māori culture and language',
      features: [
        'Basic vocabulary and phrases',
        'Simple cultural concepts',
        'Guided learning with hints',
        'Extra cultural context provided'
      ],
      icon: '🌱',
      pointsMultiplier: 1,
      estimatedTime: '5-10 minutes per day'
    },
    {
      id: 'intermediate',
      title: 'Ākonga (Intermediate)',
      description: 'For learners with some cultural knowledge',
      features: [
        'Expanded vocabulary',
        'Cultural traditions and customs',
        'Interactive storytelling',
        'Moderate challenge activities'
      ],
      icon: '🌿',
      pointsMultiplier: 1.5,
      estimatedTime: '10-15 minutes per day'
    },
    {
      id: 'advanced',
      title: 'Pouako (Advanced)',
      description: 'Deep cultural immersion and complex concepts',
      features: [
        'Advanced language concepts',
        'Historical and spiritual teachings',
        'Complex cultural protocols',
        'Independent exploration'
      ],
      icon: '🌳',
      pointsMultiplier: 2,
      estimatedTime: '15-20 minutes per day'
    }
  ]

  const handleDifficultySelect = async () => {
    if (!selectedDifficulty || !profile) return

    setIsUpdating(true)
    try {
      await updateProfile({
        difficulty_level: selectedDifficulty as 'beginner' | 'intermediate' | 'advanced'
      })

      // Redirect to dashboard to start the journey
      router.push('/dashboard')
    } catch (error) {
      console.error('Error updating difficulty:', error)
      setIsUpdating(false)
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
                <p className="text-sm text-muted-foreground">Choose Your Learning Level</p>
              </div>
            </div>
            {character && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-lg">🦅</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{character.name}</p>
                  <p className="text-xs text-muted-foreground">Your Guardian</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h2 className="text-4xl font-bold">Choose Your Learning Journey</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Select the difficulty level that matches your cultural knowledge and desired learning pace.
                {character && ` ${character.name} will guide you through your chosen path.`}
              </p>
            </motion.div>
          </div>

          {/* Difficulty Options */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {difficultyLevels.map((level, index) => (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <Card
                  className={`
                    cultural-card h-full cursor-pointer transition-all duration-300 hover:scale-105
                    ${selectedDifficulty === level.id
                      ? 'ring-2 ring-primary bg-primary/5 border-primary'
                      : 'hover:border-primary/50'
                    }
                  `}
                  onClick={() => setSelectedDifficulty(level.id)}
                >
                  <CardHeader className="text-center space-y-4">
                    <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
                      <span className="text-3xl">{level.icon}</span>
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{level.title}</CardTitle>
                      <CardDescription className="text-base mt-2">
                        {level.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Features */}
                    <div>
                      <h4 className="font-semibold mb-3">What you'll learn:</h4>
                      <ul className="space-y-2">
                        {level.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-primary font-bold">•</span>
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">
                          {level.pointsMultiplier}x
                        </div>
                        <div className="text-xs text-muted-foreground">Points</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-accent">
                          {level.estimatedTime}
                        </div>
                        <div className="text-xs text-muted-foreground">Per Day</div>
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {selectedDifficulty === level.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-center pt-4"
                      >
                        <Badge className="bg-primary text-primary-foreground">
                          ✓ Selected
                        </Badge>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <Button
              onClick={handleDifficultySelect}
              disabled={!selectedDifficulty || isUpdating}
              size="lg"
              className="px-12"
            >
              {isUpdating ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  <span>Setting Up Your Journey...</span>
                </div>
              ) : (
                'Begin My Cultural Adventure'
              )}
            </Button>

            {selectedDifficulty && (
              <p className="text-sm text-muted-foreground mt-4">
                You can change your difficulty level anytime in your profile settings
              </p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
