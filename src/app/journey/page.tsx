'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion, useScroll, useTransform } from 'framer-motion'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface DayNode {
  day: number
  title: string
  isUnlocked: boolean
  isCompleted: boolean
  activityType: 'quiz' | 'game' | 'story' | 'learning'
  points: number
}

interface Activity {
  id: string
  day: number
  title: string
  description: string
  type: 'quiz' | 'game' | 'story' | 'learning'
  difficulty: string
  points: number
}

export default function Journey() {
  const { isAuthenticated, user, profile, character, loading } = useAuth()
  const router = useRouter()
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [activitiesLoading, setActivitiesLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { scrollX } = useScroll({ container: scrollRef })

  // Transform for parallax effect
  const backgroundX = useTransform(scrollX, [0, 1000], [0, -200])

  // Fetch activities from Firebase
  const fetchActivities = async () => {
    try {
      console.log('Fetching activities from Firebase...')
      const activitiesRef = collection(db, 'activities')
      const q = query(
        activitiesRef,
        where('difficulty', '==', profile?.difficulty_level || 'beginner'),
        orderBy('day')
      )
      const querySnapshot = await getDocs(q)
      
      const fetchedActivities: Activity[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        fetchedActivities.push({
          id: doc.id,
          day: data.day,
          title: data.title,
          description: data.description,
          type: data.type,
          difficulty: data.difficulty,
          points: data.points
        })
      })
      
      console.log('Fetched activities:', fetchedActivities)
      setActivities(fetchedActivities)
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setActivitiesLoading(false)
    }
  }

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (profile?.difficulty_level && activitiesLoading) {
      fetchActivities()
    }
  }, [profile?.difficulty_level, activitiesLoading])

  if (loading || activitiesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg">Loading your cultural journey...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !profile) {
    return null
  }

  // Generate day nodes for the journey
  const generateDayNodes = (): DayNode[] => {
    const activityTypes: ('quiz' | 'game' | 'story' | 'learning')[] = ['quiz', 'game', 'story', 'learning']
    const difficultyMultiplier = getDifficultyMultiplier(profile?.difficulty_level)

    return Array.from({ length: 30 }, (_, index) => {
      const day = index + 1
      // Enhanced unlock logic based on difficulty and progression
      const isUnlocked = isActivityUnlocked(day, profile?.current_day || 1, profile?.difficulty_level)
      const isCompleted = day < (profile?.current_day || 1)

      // Find activity for this day
      const activity = activities.find(a => a.day === day)
      
      return {
        day,
        title: activity?.title || `Day ${day}`,
        isUnlocked,
        isCompleted,
        activityType: (activity?.type as 'quiz' | 'game' | 'story' | 'learning') || activityTypes[(day - 1) % 4],
        points: activity?.points || Math.floor(getDayPoints(day) * difficultyMultiplier)
      }
    })
  }

  const getDayTitle = (day: number, difficulty?: string | null): string => {
    const beginnerTitles = [
      "Kia Ora", "Numbers 1-5", "My Whānau", "Hongi Greeting", "Simple Pōwhiri",
      "Basic Colors", "Kai Māori", "Simple Haka", "Family Tree", "Nature Walk",
      "Life Energy", "Bird Sounds", "My Story", "Local Area", "Garden Birds",
      "Our Land", "Helpful Spirits", "Good Values", "Showing Love", "Being Kind",
      "My Community", "Green Stone", "Shared Meal", "Simple Dance", "Happy Songs",
      "Basic Art", "Face Patterns", "Meeting House", "Boat Journey", "New Zealand"
    ]

    const intermediateTitles = [
      "Kia Ora Customs", "Numbers 1-20", "Extended Whānau", "Hongi Protocol", "Pōwhiri Process",
      "Color Meanings", "Traditional Kai", "Haka Movements", "Whakapapa Lines", "Te Taiao Balance",
      "Mauri Connections", "Tūī Language", "Kōrero Traditions", "Tribal Areas", "Native Birds",
      "Whenua Guardians", "Atua Guidance", "Tikanga Rules", "Aroha Practices", "Manaakitanga Ways",
      "Iwi Heritage", "Pounamu Wisdom", "Hangi Cooking", "Kapa Haka Forms", "Waiata Styles",
      "Cultural Art", "Tā Moko Stories", "Wharenui Features", "Waka Navigation", "Aotearoa History"
    ]

    const advancedTitles = [
      "Kia Ora Philosophy", "Mathematical Concepts", "Whānau Dynamics", "Hongi Spirituality", "Pōwhiri Ceremonial",
      "Color Symbolism", "Kai & Ceremony", "Haka as Expression", "Whakapapa Complexity", "Te Taiao Systems",
      "Mauri Philosophy", "Tūī as Messenger", "Oral Traditions", "Territorial History", "Ecological Roles",
      "Land Relationships", "Atua Cosmology", "Tikanga Depth", "Aroha Complexity", "Manaakitanga Ethics",
      "Iwi Governance", "Pounamu Metaphysics", "Hangi Rituals", "Kapa Haka Excellence", "Waiata Composition",
      "Contemporary Art", "Tā Moko Meanings", "Wharenui Architecture", "Waka Traditions", "Aotearoa Future"
    ]

    let titles = beginnerTitles
    if (difficulty === 'intermediate') titles = intermediateTitles
    else if (difficulty === 'advanced') titles = advancedTitles

    return titles[day - 1] || `Day ${day}`
  }

  const getDayPoints = (day: number): number => {
    // Points increase as journey progresses
    if (day <= 10) return 10
    if (day <= 20) return 15
    return 20
  }

  const getDifficultyMultiplier = (difficulty?: string | null): number => {
    switch (difficulty) {
      case 'beginner': return 1
      case 'intermediate': return 1.5
      case 'advanced': return 2
      default: return 1
    }
  }

  const isActivityUnlocked = (day: number, currentDay: number, difficulty?: string | null): boolean => {
    // Base unlock logic: current day and before
    if (day <= currentDay) return true

    // Advanced users can see one day ahead
    if (difficulty === 'advanced' && day <= currentDay + 1) return true

    // Intermediate users can see current day only
    if (difficulty === 'intermediate' && day <= currentDay) return true

    // Beginners follow strict day-by-day progression
    return false
  }

  const getActivityIcon = (type: string): string => {
    switch (type) {
      case 'quiz': return '🧠'
      case 'game': return '🎮'
      case 'story': return '📖'
      case 'learning': return '🌱'
      default: return '⭐'
    }
  }

  const dayNodes = generateDayNodes()
  const currentDayIndex = (profile?.current_day || 1) - 1

  const handleDayClick = (day: DayNode) => {
    if (!day.isUnlocked) {
      console.log('🔒 Activity locked for day:', day.day)
      return
    }
    console.log('👆 Day clicked:', day.day, 'Setting selected day')
    setSelectedDay(day.day)
  }

  const startActivity = () => {
    console.log('🚀 Starting activity for day:', selectedDay)
    if (selectedDay) {
      console.log('📍 Navigating to:', `/activity/${selectedDay}`)
      router.push(`/activity/${selectedDay}`)
    } else {
      console.error('❌ No selectedDay found')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
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
                  <span className="text-primary-foreground text-sm">🌿</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold">Cultural Journey</h1>
                  {character && (
                    <p className="text-xs text-muted-foreground">
                      With {character.name}
                    </p>
                  )}
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

      {/* Journey Trail */}
      <div className="relative overflow-hidden">
        {/* Parallax Background */}
        <motion.div
          style={{ x: backgroundX }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="w-[150%] h-full bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 opacity-50"></div>
        </motion.div>

        {/* Main Scrolling Container */}
        <div
          ref={scrollRef}
          className="horizontal-scroll pb-8 pt-16"
          style={{
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollSnapType: 'x mandatory'
          }}
        >
          <div className="flex items-center space-x-6 px-8" style={{ width: 'max-content' }}>
            {/* Trail Line */}
            <div className="absolute top-1/2 left-0 right-0 h-2 trail-path -translate-y-1/2 opacity-30 -z-10"></div>

            {dayNodes.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex-shrink-0 scroll-snap-align-center"
                style={{ scrollSnapAlign: 'center' }}
              >
                <div className="relative">
                  {/* Day Node */}
                  <motion.div
                    whileHover={day.isUnlocked ? { scale: 1.05 } : {}}
                    whileTap={day.isUnlocked ? { scale: 0.95 } : {}}
                    className={`
                      w-24 h-24 rounded-full flex flex-col items-center justify-center cursor-pointer
                      border-4 transition-all duration-300 relative
                      ${day.isCompleted
                        ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                        : day.isUnlocked
                        ? 'bg-background border-primary hover:bg-primary/10 shadow-md'
                        : 'bg-muted border-muted-foreground/30 cursor-not-allowed opacity-60'
                      }
                    `}
                    onClick={() => handleDayClick(day)}
                  >
                    {/* Day Number */}
                    <span className="text-lg font-bold">{day.day}</span>

                    {/* Activity Type Icon */}
                    <span className="text-xs">{getActivityIcon(day.activityType)}</span>

                    {/* Completion Badge */}
                    {day.isCompleted && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                        <span className="text-xs">✓</span>
                      </div>
                    )}

                    {/* Current Day Indicator */}
                    {day.day === profile.current_day && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -inset-2 border-2 border-accent rounded-full opacity-50"
                      />
                    )}
                  </motion.div>

                  {/* Day Info Below */}
                  <div className="text-center mt-3 max-w-24">
                    <p className="text-xs font-medium truncate">{day.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {day.points} pts
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Day Details */}
      {selectedDay && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t p-6 z-40"
        >
          <div className="container mx-auto max-w-2xl">
            <Card className="cultural-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      Day {selectedDay}: {dayNodes[selectedDay - 1]?.title?.replace(/^Day \d+:\s*/, '') || 'Activity'}
                    </CardTitle>
                    <CardDescription className="flex items-center space-x-2 mt-1">
                      <span>{getActivityIcon(dayNodes[selectedDay - 1].activityType)}</span>
                      <span className="capitalize">{dayNodes[selectedDay - 1].activityType} Activity</span>
                      <span>•</span>
                      <span>{getDayPoints(selectedDay)} points</span>
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedDay(null)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Discover the beauty of Māori culture through this interactive {dayNodes[selectedDay - 1].activityType} activity.
                  Your guardian {character?.name || 'will guide'} you through this cultural learning experience.
                </p>

                <div className="flex space-x-3">
                  <Button
                    onClick={startActivity}
                    className="flex-1"
                  >
                    Start Activity
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedDay(null)}
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Character Guide */}
      {character && (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed left-4 bottom-20 z-30 hidden lg:block"
        >
          <Card className="cultural-card p-4 max-w-64">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">🦅</span>
              </div>
              <div>
                <p className="font-semibold text-sm">{character.name}</p>
                <p className="text-xs text-muted-foreground">Your Cultural Guardian</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              "Scroll horizontally to explore your cultural journey. Each day holds new wisdom to discover."
            </p>
          </Card>
        </motion.div>
      )}

      {/* Progress Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-muted z-50">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{
            width: `${((profile.current_day || 1) / 30) * 100}%`
          }}
        />
      </div>
    </div>
  )
}
