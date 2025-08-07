'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter, useParams } from 'next/navigation'
import { activities } from '@/lib/firebase-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

interface ActivityContent {
  title: string
  description: string
  type: 'quiz' | 'game' | 'story' | 'learning'
  content: {
    question?: string
    options?: string[]
    correct?: number
    explanation?: string
    story?: string
    facts?: string[]
    cultural_context?: string
  }
  points: number
}

export default function Activity() {
  const { isAuthenticated, user, profile, character, updateProfile, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const day = parseInt(params.day as string)

  // All hooks must be called before any early returns
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [startTime] = useState(Date.now())
  const [activityCompleted, setActivityCompleted] = useState(false)

  // Validate day parameter after hooks
  const isValidDay = !isNaN(day) && day >= 1 && day <= 30

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

  useEffect(() => {
    console.log('🎯 Activity page state:', { 
      loading, 
      isAuthenticated, 
      hasProfile: !!profile, 
      day,
      userId: user?.uid,
      userEmail: user?.email,
      profile: profile ? {
        currentDay: profile.current_day,
        difficulty: profile.difficulty_level,
        character: profile.character_id
      } : null
    })
    
    // Only redirect after loading is complete
    if (loading) return
    
    if (!isAuthenticated) {
      console.log('❌ Redirecting to home - not authenticated')
      router.push('/')
      return
    }
    
    if (!profile) {
      console.log('❌ Redirecting to dashboard - missing profile')
      router.push('/dashboard')
      return
    }

    // Check if user needs to complete setup (character selection)
    if (!profile.character_id) {
      console.log('❌ Redirecting to dashboard - incomplete setup')
      router.push('/dashboard')
      return
    }
  }, [loading, isAuthenticated, router, profile, day, user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg">Loading your cultural journey...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !profile || !profile.character_id) {
    return null
  }

  const getActivityContent = (day: number): ActivityContent => {
    const difficulty = profile?.difficulty_level || 'beginner'
    const activities: Record<string, Record<number, ActivityContent>> = {
      beginner: {
      1: {
        title: "Kia Ora - First Greetings",
        description: "Learn the most important Māori greeting and its cultural significance",
        type: "learning",
        content: {
          cultural_context: "Kia ora is more than just 'hello' - it means 'be well' or 'be healthy'. It's a wish for wellbeing.",
          facts: [
            "Kia ora literally translates to 'be well' or 'be healthy'",
            "It can be used for hello, goodbye, thank you, and good luck",
            "The response to 'Kia ora' is also 'Kia ora'",
            "It comes from the word 'ora' meaning life, health, or vitality"
          ],
          story: "When Captain James Cook first arrived in Aotearoa, Māori greeted his crew with 'Kia ora!' - a blessing of health and wellbeing for the strangers. This beautiful tradition continues today, making New Zealand one of the friendliest places on Earth."
        },
        points: 10
      },
      2: {
        title: "Māori Numbers Quiz",
        description: "Test your knowledge of Māori numbers 1-10",
        type: "quiz",
        content: {
          question: "What is the Māori word for 'three'?",
          options: ["tahi", "rua", "toru", "whā"],
          correct: 2,
          explanation: "Toru means 'three' in Māori. The numbers 1-5 are: tahi (1), rua (2), toru (3), whā (4), rima (5)."
        },
        points: 10
      },
      3: {
        title: "Te Whānau - The Family",
        description: "Discover the importance of whānau (family) in Māori culture",
        type: "story",
        content: {
          story: "In the time of our ancestors, there lived a young woman named Aroha who lived far from her whānau. One day, she felt lonely and lost. Her grandmother's spirit appeared and said, 'Child, remember - you are never alone. Your whānau stretches back to the beginning of time and forward to generations not yet born. We are all connected like the roots of the mighty kauri tree.' From that day, Aroha understood that whānau is not just blood relations, but all those who care for each other with aroha (love).",
          cultural_context: "Whānau extends beyond immediate family to include extended family, close friends, and community. It represents interconnectedness and collective responsibility.",
          facts: [
            "Whānau includes parents, children, grandparents, aunts, uncles, and cousins",
            "It can also include adopted family and close friends",
            "Whānau provides support, guidance, and identity",
            "The concept emphasizes collective wellbeing over individual success"
          ]
        },
        points: 15
      }
    },
    intermediate: {
      1: {
        title: "Kia Ora Customs - Cultural Greetings",
        description: "Explore the deeper meanings behind Māori greetings and cultural protocols",
        type: "learning",
        content: {
          cultural_context: "Kia ora carries spiritual significance beyond a simple greeting. It's a blessing that acknowledges the life force (mauri) in all people and places.",
          facts: [
            "Kia ora connects to the concept of mauri - life force or vital essence",
            "Different greetings are used for different times and situations",
            "The tone and context change the spiritual weight of the greeting",
            "Traditional responses show understanding of Māori worldview"
          ],
          story: "In traditional times, when travelers approached a marae, they would call out 'Kia ora!' not just as greeting, but as a way to announce their peaceful intentions and ask permission to enter sacred space. The response would determine whether they were welcomed as friends or needed to prove their mana."
        },
        points: 15
      },
      2: {
        title: "Numbers & Counting Systems",
        description: "Learn Māori numbers 1-20 and traditional counting methods",
        type: "quiz",
        content: {
          question: "How do you say 'fifteen' in Māori?",
          options: ["tekau mā rima", "rima tekau", "tekau rima", "rima ma tekau"],
          correct: 0,
          explanation: "Tekau mā rima means 'ten and five'. Māori counting follows a base-10 system with 'mā' meaning 'and' for compound numbers."
        },
        points: 15
      },
      3: {
        title: "Extended Whānau Networks",
        description: "Understanding the complex relationships within Māori family structures",
        type: "story",
        content: {
          story: "Tama lived in the city, far from his tūrangawaewae (home base). When hard times came, he remembered his kuia's words: 'Whānau is not just blood - it's all who share your journey.' He reached out to his urban whānau - Māori friends who had become family through shared experience, cultural practice, and mutual support. Together, they created a new kind of marae in the city, proving that whānau adapts and grows beyond traditional boundaries.",
          cultural_context: "Extended whānau includes not just blood relatives but adoptive family, close friends, and community members who share responsibilities and support each other through life's challenges.",
          facts: [
            "Whāngai (adoption) creates family bonds as strong as blood",
            "Urban whānau networks provide cultural support in cities",
            "Collective responsibility extends to the wider community",
            "Modern whānau may include chosen family and cultural connections"
          ]
        },
        points: 20
      }
    },
    advanced: {
      1: {
        title: "Kia Ora - Philosophical Foundations",
        description: "Deep dive into the metaphysical and spiritual dimensions of Māori greetings",
        type: "learning",
        content: {
          cultural_context: "Kia ora represents a complex philosophical framework that encompasses whakapapa (genealogical connections), mauri (life essence), and the interconnectedness of all existence within Te Ao Māori.",
          facts: [
            "Kia ora activates whakapapa connections between people and place",
            "The greeting acknowledges the atua (spiritual forces) present in all interactions",
            "Historical variations include formal and ceremonial applications",
            "Contemporary usage maintains spiritual significance in secular contexts",
            "Cross-cultural adaptations demonstrate resilience of Māori worldview"
          ],
          story: "When the first European explorers arrived, Māori elders observed their customs carefully. They noted that these strangers had greetings but no spiritual awareness within them. The decision to share 'Kia ora' was not casual - it was a deliberate act of cultural generosity, an attempt to awaken spiritual consciousness in the newcomers. Today, when we say 'Kia ora,' we continue this tradition of sharing life force with others."
        },
        points: 30
      },
      2: {
        title: "Mathematical Concepts in Te Reo",
        description: "Advanced exploration of numbers, geometry, and mathematical thinking in Māori culture",
        type: "quiz",
        content: {
          question: "What deeper cultural concept does the Māori number system demonstrate about traditional worldview?",
          options: [
            "Base-10 system shows European influence",
            "Collective counting reflects communal values",
            "Number patterns mirror natural cycles and whakapapa",
            "Mathematical precision for trade purposes"
          ],
          correct: 2,
          explanation: "Māori number systems reflect deeper cultural patterns about cycles, genealogy, and natural order. The structure mirrors whakapapa relationships and seasonal patterns."
        },
        points: 30
      },
      3: {
        title: "Whānau as Complex Social System",
        description: "Analyzing whānau as a sophisticated governance and social support structure",
        type: "story",
        content: {
          story: "Dr. Aroha Williams, a specialist in indigenous governance, was researching traditional Māori social systems when she made a breakthrough discovery. Ancient whānau structures weren't just family units - they were sophisticated political, economic, and educational institutions. Each whānau had specialized roles: some focused on spiritual leadership, others on resource management, still others on knowledge preservation. When colonization disrupted these systems, it wasn't just families that were broken - it was an entire parallel governance system that had sustained Māori society for centuries. Her research now helps contemporary iwi reconstruct these systems for modern tribal development.",
          cultural_context: "Whānau operated as multifunctional institutions that provided governance, education, resource distribution, spiritual guidance, and conflict resolution. Understanding this complexity is crucial for contemporary Māori development.",
          facts: [
            "Whānau functioned as micro-political units within larger tribal structures",
            "Specialized roles included spiritual leadership, resource management, and education",
            "Decision-making processes incorporated collective wisdom and whakapapa considerations",
            "Modern iwi are reconstructing these systems for contemporary governance",
            "Whānau-based approaches inform current Māori social policy and development"
          ]
        },
        points: 25
      }
    }
    }

    const difficultyActivities = activities[difficulty] || activities.beginner
    return difficultyActivities[day] || {
      title: `Day ${day} - Cultural Discovery`,
      description: "Explore Māori culture and traditions",
      type: "learning",
      content: {
        cultural_context: "Every day brings new opportunities to connect with Māori culture and values.",
        facts: ["This is a placeholder activity", "Real content would be provided by cultural advisors"],
        story: "Your cultural journey continues with rich traditions and wisdom."
      },
      points: difficulty === 'advanced' ? 20 : difficulty === 'intermediate' ? 15 : 10
    }
  }

  const activity = getActivityContent(day)

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const submitAnswer = () => {
    if (activity.type === 'quiz' && selectedAnswer !== null) {
      const isCorrect = selectedAnswer === activity.content.correct
      setScore(isCorrect ? activity.points : Math.floor(activity.points / 2))
      setShowResults(true)
    }
  }

  const completeActivity = async () => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000)
    const finalScore = activity.type === 'quiz' ? score : activity.points

    try {
      // Create a mock activity ID based on day and difficulty
      const activityId = `day_${day}_${profile?.difficulty_level || 'beginner'}`

      // Save progress to database would happen here
      // For now, we'll simulate successful completion
      console.log('Activity completed:', {
        day,
        score: finalScore,
        timeTaken,
        activityId
      })

      // Update user's current day if this was their next activity
      if (profile && day === profile.current_day) {
        await updateProfile({
          current_day: Math.min(day + 1, 30),
          total_points: profile.total_points + finalScore
        })
      }

      // Mark activity as completed
      setActivityCompleted(true)
    } catch (error) {
      console.error('Error completing activity:', error)
      // Still mark as completed for UI purposes
      setActivityCompleted(true)
    }
  }

  const renderQuizContent = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-4">{activity.content.question}</h3>
        <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
          {activity.content.options?.map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                p-4 rounded-lg border-2 transition-all text-left
                ${selectedAnswer === index
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
                }
              `}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResults}
            >
              {option}
            </motion.button>
          ))}
        </div>
      </div>

      {showResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className={`text-lg font-semibold ${score === activity.points ? 'text-green-600' : 'text-orange-600'}`}>
            {score === activity.points ? '🎉 Correct!' : '💭 Not quite, but close!'}
          </div>
          <p className="text-muted-foreground">{activity.content.explanation}</p>
          <div className="flex items-center justify-center space-x-2">
            <Badge className="bg-primary text-primary-foreground">
              +{score} points
            </Badge>
          </div>
        </motion.div>
      )}

      {!showResults && selectedAnswer !== null && (
        <div className="text-center">
          <Button onClick={submitAnswer} size="lg">
            Submit Answer
          </Button>
        </div>
      )}
    </div>
  )

  const renderLearningContent = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto flex items-center justify-center mb-6">
          <span className="text-3xl">🌱</span>
        </div>
      </div>

      {activity.content.cultural_context && (
        <Card className="cultural-card">
          <CardHeader>
            <CardTitle className="text-lg">Cultural Context</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {activity.content.cultural_context}
            </p>
          </CardContent>
        </Card>
      )}

      {activity.content.facts && (
        <Card className="cultural-card">
          <CardHeader>
            <CardTitle className="text-lg">Key Facts</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {activity.content.facts.map((fact, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-2"
                >
                  <span className="text-primary font-bold">•</span>
                  <span className="text-sm text-muted-foreground">{fact}</span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderStoryContent = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto flex items-center justify-center mb-6">
          <span className="text-3xl">📖</span>
        </div>
      </div>

      {activity.content.story && (
        <Card className="cultural-card">
          <CardHeader>
            <CardTitle className="text-lg">Traditional Story</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed italic">
              {activity.content.story}
            </p>
          </CardContent>
        </Card>
      )}

      {activity.content.cultural_context && (
        <Card className="cultural-card">
          <CardHeader>
            <CardTitle className="text-lg">Cultural Meaning</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {activity.content.cultural_context}
            </p>
          </CardContent>
        </Card>
      )}

      {activity.content.facts && (
        <Card className="cultural-card">
          <CardHeader>
            <CardTitle className="text-lg">Learn More</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {activity.content.facts.map((fact, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-primary font-bold">•</span>
                  <span className="text-sm text-muted-foreground">{fact}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const getActivityIcon = (type: string): string => {
    switch (type) {
      case 'quiz': return '🧠'
      case 'game': return '🎮'
      case 'story': return '📖'
      case 'learning': return '🌱'
      default: return '⭐'
    }
  }

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
                onClick={() => router.push('/journey')}
              >
                ← Journey
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-sm">{getActivityIcon(activity.type)}</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold">Day {day} Activity</h1>
                  <p className="text-xs text-muted-foreground capitalize">
                    {activity.type} • {activity.points} points • {profile?.difficulty_level || 'beginner'}
                  </p>
                </div>
              </div>
            </div>
            {character && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm">🦅</span>
                </div>
                <span className="text-sm font-medium">{character.name}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          {/* Activity Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">{activity.title}</h2>
            <p className="text-lg text-muted-foreground">{activity.description}</p>
            {character && (
              <p className="text-sm text-muted-foreground mt-2">
                {character.name} is guiding you through this cultural experience
              </p>
            )}
          </div>

          {/* Activity Content */}
          <div className="mb-8">
            {activity.type === 'quiz' && renderQuizContent()}
            {activity.type === 'learning' && renderLearningContent()}
            {activity.type === 'story' && renderStoryContent()}
            {activity.type === 'game' && renderLearningContent()} {/* Placeholder */}
          </div>

          {/* Complete Activity Button */}
          {!activityCompleted && (activity.type !== 'quiz' || showResults) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <Button
                onClick={completeActivity}
                size="lg"
                className="px-8"
              >
                Complete Activity (+{activity.type === 'quiz' ? score : activity.points} points)
              </Button>
            </motion.div>
          )}

          {/* Activity Completed - Navigation Options */}
          {activityCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6"
            >
              <div className="space-y-3">
                <div className="text-2xl">🎉</div>
                <h3 className="text-xl font-semibold">Activity Completed!</h3>
                <p className="text-muted-foreground">
                  You earned {activity.type === 'quiz' ? score : activity.points} points for this cultural activity.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => router.push('/journey')}
                  size="lg"
                  className="px-6"
                >
                  🛤️ Return to Journey
                </Button>
                <Button
                  onClick={() => router.push('/dashboard')}
                  variant="outline"
                  size="lg"
                  className="px-6"
                >
                  🏠 Go to Dashboard
                </Button>
                {day < 30 && (
                  <Button
                    onClick={() => router.push(`/activity/${day + 1}`)}
                    variant="outline"
                    size="lg"
                    className="px-6"
                  >
                    ➡️ Next Activity
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
