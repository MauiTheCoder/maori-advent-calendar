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

  useEffect(() => {
    // Don't run effect if day is invalid
    if (!isValidDay) return
    
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
          title: "Pronunciation Practice",
          description: "Review your pronunciation using the guides on the Mahuru website. Practice pronouncing different Māori place names correctly.",
          type: "learning",
          content: {
            cultural_context: "Correct pronunciation of te reo Māori shows respect and helps maintain the integrity of the language.",
            facts: [
              "Visit the Mahuru website for pronunciation guides",
              "Practice Māori place names in your area",
              "Focus on vowel sounds: a, e, i, o, u",
              "Listen to native speakers whenever possible"
            ]
          },
          points: 10
        },
        2: {
          title: "Greeting Everyone",
          description: "Greet everyone you encounter today in te reo Māori.",
          type: "learning",
          content: {
            cultural_context: "Using Māori greetings in daily life helps normalize the language and shows cultural respect.",
            facts: [
              "Use 'Kia ora' throughout the day",
              "Try 'Morena' for good morning",
              "Practice with whānau, friends, and colleagues",
              "Notice people's positive responses"
            ]
          },
          points: 10
        },
        3: {
          title: "Saying Goodbye",
          description: "Practice saying goodbye in te reo Māori today.",
          type: "learning",
          content: {
            cultural_context: "Māori farewells carry deep meaning about ongoing connections and care for others.",
            facts: [
              "Use 'Kia ora' as goodbye",
              "Try 'Hei konā' or 'Hei konei'",
              "Practice 'Kā kite' for 'see you later'",
              "Use farewells with intention and care"
            ]
          },
          points: 10
        },
        4: {
          title: "Introduction Practice",
          description: "Learn how to introduce yourself in te reo Māori: your name, where you're from, and where you live now.",
          type: "learning",
          content: {
            cultural_context: "Proper introductions in Māori culture establish whakapapa (connections) and place.",
            facts: [
              "Start with 'Ko [name] ahau' (I am [name])",
              "Say 'Nō [place] ahau' (I am from [place])",
              "Use 'Kei [place] ahau e noho nei' (I live at [place])",
              "Practice your full pepeha structure"
            ]
          },
          points: 10
        },
        5: {
          title: "Home Vocabulary",
          description: "Find the kupu Māori for 5 objects at home and use those kupu throughout the day.",
          type: "learning",
          content: {
            cultural_context: "Learning everyday vocabulary helps integrate te reo Māori into daily life naturally.",
            facts: [
              "Choose common objects you use daily",
              "Practice saying the kupu aloud",
              "Use sticky notes to label objects",
              "Share new kupu with your whānau"
            ]
          },
          points: 10
        },
        6: {
          title: "Health Check-ins",
          description: "Ask someone how they're doing in te reo Māori and learn 3 different responses that you could use when asked.",
          type: "learning",
          content: {
            cultural_context: "Checking on others' wellbeing is central to Māori values of manaakitanga.",
            facts: [
              "Ask 'Kei a koe?' (How are you?)",
              "Learn responses like 'Kei te pai' (I'm good)",
              "Practice 'Kāore he raru' (No worries/problems)",
              "Try 'Kei te reka' (I'm sweet/good)"
            ]
          },
          points: 10
        },
        7: {
          title: "Workplace Labels",
          description: "Label 5 objects at work with their kupu Māori and teach them to your coworkers.",
          type: "learning",
          content: {
            cultural_context: "Sharing te reo Māori knowledge helps create inclusive environments and builds cultural awareness.",
            facts: [
              "Choose objects everyone uses",
              "Write clear labels with pronunciation",
              "Explain meanings to interested colleagues",
              "Encourage others to use the kupu"
            ]
          },
          points: 10
        },
        8: {
          title: "Email Phrase",
          description: "Use one new reo Māori phrase in an email or message today.",
          type: "learning",
          content: {
            cultural_context: "Incorporating te reo Māori in written communication helps normalize its use in professional settings.",
            facts: [
              "Start with simple greetings",
              "Use 'Ngā mihi' for 'regards'",
              "Try 'Kia pai tō mutu wiki' (have a good weekend)",
              "Include pronunciation guides if helpful"
            ]
          },
          points: 10
        },
        9: {
          title: "Friend Introduction",
          description: "Practice introducing a friend or family member.",
          type: "learning",
          content: {
            cultural_context: "Introducing others properly shows respect and helps build connections within communities.",
            facts: [
              "Use 'Kō [name] tēnei' (This is [name])",
              "Share their place connections if appropriate",
              "Practice with whānau members",
              "Include relationship connections"
            ]
          },
          points: 10
        },
        10: {
          title: "Shopping List",
          description: "Translate your supermarket shopping list into te reo Māori.",
          type: "learning",
          content: {
            cultural_context: "Learning food vocabulary connects us to traditional Māori kai and modern shopping practices.",
            facts: [
              "Learn common food items",
              "Practice fruit and vegetable names",
              "Include traditional kai when possible",
              "Use the list while shopping"
            ]
          },
          points: 10
        },
        11: {
          title: "Weather Description",
          description: "Learn how to describe today's weather in te reo Māori.",
          type: "learning",
          content: {
            cultural_context: "Weather discussions are common social interactions and connect us to the natural world.",
            facts: [
              "Learn 'He rā pai' (nice day)",
              "Practice 'He ua' (it's raining)",
              "Try 'He makariri' (it's cold)",
              "Use 'He wera' (it's hot)"
            ]
          },
          points: 10
        },
        12: {
          title: "Simple Pepeha",
          description: "Learn how to compose and share a simple pepeha.",
          type: "learning",
          content: {
            cultural_context: "Pepeha establish your identity and connections to place, providing a foundation for relationships.",
            facts: [
              "Include your maunga (mountain)",
              "Name your awa (river)",
              "State your iwi or tribal connections",
              "Practice sharing with others"
            ]
          },
          points: 10
        },
        13: {
          title: "Meeting Karakia",
          description: "Write out a simple karakia that you can say at the start of meetings, and practice saying it in all the hui you have today.",
          type: "learning",
          content: {
            cultural_context: "Karakia bring spiritual protection and intention to gatherings, creating sacred space.",
            facts: [
              "Keep it simple and respectful",
              "Practice pronunciation beforehand",
              "Explain the purpose to others",
              "Use with genuine intention"
            ]
          },
          points: 10
        },
        14: {
          title: "Multiple Greetings",
          description: "Learn how to say hello to one person, two people, and three or more people. Practice each today.",
          type: "learning",
          content: {
            cultural_context: "Different greetings for different numbers of people show understanding of Māori grammar structure.",
            facts: [
              "Use 'Kia ora' for one person",
              "Say 'Kia ora kōrua' for two people",
              "Use 'Kia ora koutou' for three or more",
              "Practice in different social situations"
            ]
          },
          points: 10
        },
        15: {
          title: "Waiata Vocabulary",
          description: "Listen to a waiata in te reo Māori and write down all the kupu you recognise.",
          type: "learning",
          content: {
            cultural_context: "Waiata are repositories of language, culture, and history, teaching through music and rhythm.",
            facts: [
              "Choose a well-known waiata",
              "Listen multiple times",
              "Look up unfamiliar words",
              "Try to understand the overall message"
            ]
          },
          points: 10
        },
        16: {
          title: "Learning Partner",
          description: "Find another person in your life who is learning te reo Māori and share your 'why' with each other.",
          type: "learning",
          content: {
            cultural_context: "Sharing your motivation strengthens commitment and builds supportive learning communities.",
            facts: [
              "Be honest about your reasons",
              "Listen actively to their story",
              "Support each other's journey",
              "Create accountability partnerships"
            ]
          },
          points: 10
        },
        17: {
          title: "Reading Practice",
          description: "Read a book that features kupu Māori. Even if it's for children, kei te pai!",
          type: "learning",
          content: {
            cultural_context: "Reading helps internalize language patterns and cultural concepts through storytelling.",
            facts: [
              "Start with your comfort level",
              "Children's books have great foundations",
              "Focus on understanding over perfection",
              "Enjoy the learning process"
            ]
          },
          points: 10
        },
        18: {
          title: "Counting Practice",
          description: "Learn to count to 20 in te reo Māori.",
          type: "learning",
          content: {
            cultural_context: "Numbers are fundamental building blocks for more complex language use and daily communication.",
            facts: [
              "Master 1-10 first: tahi, rua, toru, whā, rima, ono, whitu, waru, iwa, tekau",
              "Learn the teens pattern with 'tekau mā'",
              "Practice counting objects around you",
              "Use numbers in daily activities"
            ]
          },
          points: 10
        },
        19: {
          title: "Days of the Week",
          description: "Write down the days of the week in te reo Māori and practice using them today.",
          type: "learning",
          content: {
            cultural_context: "Time words help organize daily life and show integration of te reo Māori into routine activities.",
            facts: [
              "Rāhina (Monday) through Rātapu (Sunday)",
              "Use in conversations about plans",
              "Practice with calendar activities",
              "Include in scheduling discussions"
            ]
          },
          points: 10
        },
        20: {
          title: "Marae Vocabulary",
          description: "Learn the ingoa Māori (Māori names) for all the different parts of a marae.",
          type: "learning",
          content: {
            cultural_context: "Understanding marae layout shows respect for sacred spaces and cultural protocols.",
            facts: [
              "Learn whare hui, whare kai, ātea",
              "Understand the wharenui significance",
              "Know where different activities happen",
              "Respect the tapu and noa spaces"
            ]
          },
          points: 10
        },
        21: {
          title: "Question Practice",
          description: "Practice asking and answering, 'He aha tēnei/tēnā/tērā?'",
          type: "learning",
          content: {
            cultural_context: "Asking questions shows curiosity and willingness to learn, fundamental to cultural growth.",
            facts: [
              "He aha tēnei = What is this (here)?",
              "He aha tēnā = What is that (near you)?",
              "He aha tērā = What is that (over there)?",
              "Practice with pointing and objects"
            ]
          },
          points: 10
        },
        22: {
          title: "Language History",
          description: "Learn about the history of te reo Māori in Aotearoa, and why the revitalisation movement started.",
          type: "learning",
          content: {
            cultural_context: "Understanding language history helps appreciate current revitalization efforts and their importance.",
            facts: [
              "Te reo was once banned in schools",
              "Language decline occurred through colonization",
              "Revitalization began in the 1970s-80s",
              "Current efforts focus on whānau transmission"
            ]
          },
          points: 10
        },
        23: {
          title: "Movement Sentences",
          description: "Learn how to tell others where you're going using the sentence structure 'Kei te haere ahau...' Tell 3 people throughout the day where you're headed!",
          type: "learning",
          content: {
            cultural_context: "Sharing your movements keeps whānau informed and maintains social connections.",
            facts: [
              "Kei te haere ahau ki te... (I'm going to...)",
              "Practice with common destinations",
              "Use with colleagues and whānau",
              "Build confidence in conversation"
            ]
          },
          points: 10
        },
        24: {
          title: "Meal Karakia",
          description: "Write out a simple karakia to say before meals. Say it with your coworkers, whānau, or friends at each meal today.",
          type: "learning",
          content: {
            cultural_context: "Meal karakia acknowledge the source of our kai and bring whānau together in gratitude.",
            facts: [
              "Keep it simple and meaningful",
              "Include gratitude for the food",
              "Practice pronunciation clearly",
              "Share the meaning with others"
            ]
          },
          points: 10
        },
        25: {
          title: "Resource Sharing",
          description: "Find three new resources – books, podcasts, TV shows, etc – to support you on your reo journey. Share them with a friend.",
          type: "learning",
          content: {
            cultural_context: "Sharing resources builds learning communities and supports collective language growth.",
            facts: [
              "Look for diverse resource types",
              "Consider your learning style",
              "Share recommendations actively",
              "Build your resource library"
            ]
          },
          points: 10
        },
        26: {
          title: "Kīwaha Practice",
          description: "Practice using a kīwaha in conversation today. Check out the kīwaha videos on the Mahuru Māori website for inspiration.",
          type: "learning",
          content: {
            cultural_context: "Kīwaha are cultural expressions that convey deeper meanings and cultural values.",
            facts: [
              "Start with simple, appropriate kīwaha",
              "Understand the cultural context",
              "Use with native speakers when possible",
              "Learn from the Mahuru website videos"
            ]
          },
          points: 10
        },
        27: {
          title: "Teaching Others",
          description: "Teach a new kupu Māori to three different people today.",
          type: "learning",
          content: {
            cultural_context: "Teaching others reinforces your own learning while spreading language knowledge through communities.",
            facts: [
              "Choose useful, relevant kupu",
              "Include pronunciation guidance",
              "Share the cultural context",
              "Encourage others to use the words"
            ]
          },
          points: 10
        },
        28: {
          title: "Whakataukī Learning",
          description: "Learn one whakataukī and explain it to a friend or whānau member.",
          type: "learning",
          content: {
            cultural_context: "Whakataukī contain cultural wisdom and values, passed down through generations.",
            facts: [
              "Choose a meaningful whakataukī",
              "Understand the deeper meaning",
              "Practice pronunciation carefully",
              "Share the wisdom appropriately"
            ]
          },
          points: 10
        },
        29: {
          title: "Coffee Orders",
          description: "Order your coffee in te reo Māori today – or, if you make it yourself, practice describing it while you're making it.",
          type: "learning",
          content: {
            cultural_context: "Using te reo Māori in daily transactions normalizes the language in commercial settings.",
            facts: [
              "Learn coffee vocabulary",
              "Practice ordering phrases",
              "Be patient with service staff",
              "Explain if asked about the language"
            ]
          },
          points: 10
        },
        30: {
          title: "Future Planning",
          description: "Post in the Mahuru Māori Facebook group how you're going to continue to grow your reo after Mahuru – or, if you're not on social media, message a friend or whānau member to help keep you accountable.",
          type: "learning",
          content: {
            cultural_context: "Committing to continued learning ensures language growth continues beyond formal challenges.",
            facts: [
              "Set realistic continuing goals",
              "Find accountability partners",
              "Plan specific learning activities",
              "Celebrate your progress so far"
            ]
          },
          points: 10
        }
      },
      intermediate: {
        1: {
          title: "5-Minute Te Reo Time",
          description: "Schedule a 5-minute slot today where you will only speak te reo Māori. Don't be afraid to use the kaupapa card on the Mahuru website to let others know what you're doing.",
          type: "learning",
          content: {
            cultural_context: "Immersive practice builds fluency and confidence in using te reo Māori continuously.",
            facts: [
              "Set a specific time for your 5-minute session",
              "Use the Mahuru kaupapa card to explain to others",
              "Don't worry about mistakes - focus on communication",
              "Gradually increase the time as you get more confident"
            ]
          },
          points: 15
        },
        2: {
          title: "Local Place Names",
          description: "Learn 3 new Māori place names around your rohe (region). Share them with a friend.",
          type: "learning",
          content: {
            cultural_context: "Place names carry historical and cultural significance, connecting us to the land and its stories.",
            facts: [
              "Research the meanings behind the names",
              "Learn correct pronunciation",
              "Share the stories with others",
              "Use them in daily conversation"
            ]
          },
          points: 15
        },
        3: {
          title: "Karakia Learning",
          description: "Write out a karakia you don't know yet and commit to learning it over the next week.",
          type: "learning",
          content: {
            cultural_context: "Learning new karakia expands your spiritual vocabulary and cultural understanding.",
            facts: [
              "Choose an appropriate karakia for your context",
              "Write it out clearly with pronunciation notes",
              "Practice daily over the week",
              "Understand its meaning and purpose"
            ]
          },
          points: 15
        },
        4: {
          title: "Marae Protocols",
          description: "Share 3 'do's and don't's' at the marae in te reo Māori with a friend, whānau member, or coworker.",
          type: "learning",
          content: {
            cultural_context: "Understanding and sharing marae protocols helps maintain cultural practices and educates others.",
            facts: [
              "Focus on respectful behavior",
              "Explain the reasoning behind protocols",
              "Use appropriate te reo Māori terms",
              "Share with cultural sensitivity"
            ]
          },
          points: 15
        },
        5: {
          title: "Kīwaha in Practice",
          description: "Practice using a kīwaha in conversation today. Check out the kīwaha videos on the Mahuru Māori website for inspiration.",
          type: "learning",
          content: {
            cultural_context: "Kīwaha add depth and cultural authenticity to your te reo Māori expression.",
            facts: [
              "Choose contextually appropriate kīwaha",
              "Practice pronunciation until natural",
              "Use with understanding of cultural meaning",
              "Learn from native speakers when possible"
            ]
          },
          points: 15
        },
        6: {
          title: "Tea/Coffee Instructions",
          description: "Write instructions for preparing your perfect cup of tea or coffee. Encourage your coworkers to do the same and keep them together in the kitchen.",
          type: "learning",
          content: {
            cultural_context: "Sharing practical instructions in te reo Māori demonstrates its utility in everyday activities.",
            facts: [
              "Write clear, step-by-step instructions",
              "Use kitchen and preparation vocabulary",
              "Encourage workplace participation",
              "Create a resource for others"
            ]
          },
          points: 15
        },
        7: {
          title: "Tense Markers Practice",
          description: "Describe your day in 6 sentences, each using a different tohu wā (tense marker): kei te, e __ ana, kua, i, i te, ka.",
          type: "learning",
          content: {
            cultural_context: "Mastering tense markers allows for more precise and grammatically correct expression.",
            facts: [
              "Kei te = currently happening",
              "E __ ana = ongoing action",
              "Kua = completed action",
              "I = past action, Ka = future action, I te = past continuous"
            ]
          },
          points: 15
        },
        8: {
          title: "Te Reo Group Chat",
          description: "Start a reo Māori group chat. See how long you and some friends or whānau can communicate using only te reo Māori.",
          type: "learning",
          content: {
            cultural_context: "Digital spaces for te reo Māori help normalize its use in modern communication.",
            facts: [
              "Invite enthusiastic participants",
              "Set encouraging group expectations",
              "Support each other's efforts",
              "Use translation tools if needed"
            ]
          },
          points: 15
        },
        9: {
          title: "Help Phrases",
          description: "Write down 4 helpful reo Māori phrases that you can use when you need help on your reo journey. (For example: I don't know, I don't understand, please say that again)",
          type: "learning",
          content: {
            cultural_context: "Having help phrases ready removes barriers to engagement and shows respect for the learning process.",
            facts: [
              "Kāore au e mōhio = I don't know",
              "Kāore au e mārama = I don't understand",
              "Me kōrero anō koe = Please say that again",
              "Keep these phrases handy"
            ]
          },
          points: 15
        },
        10: {
          title: "10-Minute Te Reo Time",
          description: "Schedule a 10-minute slot today where you will only speak te reo Māori. Don't be afraid to use the kaupapa card on the Mahuru website to let others know what you're doing.",
          type: "learning",
          content: {
            cultural_context: "Extended immersive practice builds greater confidence and natural flow in conversation.",
            facts: [
              "Double your previous time commitment",
              "Plan conversation topics beforehand",
              "Use the kaupapa card for support",
              "Focus on communication over perfection"
            ]
          },
          points: 15
        },
        11: {
          title: "Vocabulary Replacement",
          description: "Make a list of 5 kupu Māori you use regularly and see if you can replace them with a new kupu.",
          type: "learning",
          content: {
            cultural_context: "Expanding vocabulary prevents overuse of basic words and develops more sophisticated expression.",
            facts: [
              "Identify your most common kupu",
              "Find appropriate alternatives",
              "Practice using new vocabulary",
              "Build more nuanced expression"
            ]
          },
          points: 15
        },
        12: {
          title: "Treasure Hunt Instructions",
          description: "Create a 'treasure hunt' by writing instructions in te reo Māori for a friend to reach a destination of your choice. Trade instructions and see who can reach their 'treasure' first!",
          type: "learning",
          content: {
            cultural_context: "Creative activities make language learning fun while building practical communication skills.",
            facts: [
              "Use directional vocabulary",
              "Include landmarks and reference points",
              "Make it challenging but achievable",
              "Enjoy the interactive learning"
            ]
          },
          points: 15
        },
        13: {
          title: "Whakataukī Meaning",
          description: "Learn a new whakataukī and describe what it means in te reo Māori.",
          type: "learning",
          content: {
            cultural_context: "Understanding and explaining whakataukī deepens cultural knowledge and expression skills.",
            facts: [
              "Choose a meaningful whakataukī",
              "Research its origins and context",
              "Practice explaining in te reo Māori",
              "Share the cultural wisdom appropriately"
            ]
          },
          points: 15
        },
        14: {
          title: "News Summary",
          description: "Read a news article written in te reo Māori and summarise it in your own words.",
          type: "learning",
          content: {
            cultural_context: "Reading and summarizing news develops comprehension and expression skills with current content.",
            facts: [
              "Choose articles at your level",
              "Focus on main ideas",
              "Practice summarizing skills",
              "Build current affairs vocabulary"
            ]
          },
          points: 15
        },
        15: {
          title: "Photo Captions",
          description: "Pick 3 photos (from a book, from the internet, or from your home) and write a caption for each in te reo Māori.",
          type: "learning",
          content: {
            cultural_context: "Describing images in te reo Māori builds descriptive vocabulary and observational skills.",
            facts: [
              "Choose diverse, interesting photos",
              "Use descriptive language",
              "Include emotions and actions",
              "Practice visual storytelling"
            ]
          },
          points: 15
        },
        16: {
          title: "Negation Practice",
          description: "Rewrite your 6 sentences from Day 7, negating each (using 'kāore').",
          type: "learning",
          content: {
            cultural_context: "Understanding negation patterns is essential for accurate and complete expression.",
            facts: [
              "Use 'kāore' appropriately with tenses",
              "Practice negative sentence structure",
              "Compare positive and negative forms",
              "Build grammatical understanding"
            ]
          },
          points: 15
        },
        17: {
          title: "Walking Commentary",
          description: "Take a short walk and describe your surroundings out loud in te reo Māori.",
          type: "learning",
          content: {
            cultural_context: "Describing the natural world connects language learning to environmental awareness.",
            facts: [
              "Name what you see around you",
              "Describe weather and natural features",
              "Practice movement vocabulary",
              "Connect with the environment"
            ]
          },
          points: 15
        },
        18: {
          title: "Regional Events",
          description: "Find an event in your region that promotes te reo Māori and describe it to a friend in your own words.",
          type: "learning",
          content: {
            cultural_context: "Engaging with local Māori events builds community connections and cultural awareness.",
            facts: [
              "Research local cultural events",
              "Practice event description vocabulary",
              "Share opportunities with others",
              "Build community connections"
            ]
          },
          points: 15
        },
        19: {
          title: "Te Reo Email",
          description: "Write a short email or message to a friend using only te reo Māori.",
          type: "learning",
          content: {
            cultural_context: "Written communication in te reo Māori demonstrates confidence and cultural commitment.",
            facts: [
              "Start with simple, clear messages",
              "Use appropriate formal/informal language",
              "Include cultural greetings and closings",
              "Build written confidence"
            ]
          },
          points: 15
        },
        20: {
          title: "20-Minute Te Reo Time",
          description: "Schedule a 20-minute slot today where you will only speak te reo Māori. Don't be afraid to use the kaupapa card on the Mahuru website to let others know what you're doing.",
          type: "learning",
          content: {
            cultural_context: "Extended practice sessions build stamina and natural flow in te reo Māori conversation.",
            facts: [
              "Plan conversation topics in advance",
              "Use the kaupapa card for explanation",
              "Focus on maintaining communication",
              "Build extended speaking confidence"
            ]
          },
          points: 15
        },
        21: {
          title: "Home/Workplace Tour",
          description: "Give a guided tour of your home or workplace to a friend, whānau member, or coworker in te reo Māori as if they were a visitor.",
          type: "learning",
          content: {
            cultural_context: "Giving tours demonstrates hospitality while practicing descriptive and directional language.",
            facts: [
              "Prepare room and object vocabulary",
              "Practice directional phrases",
              "Include cultural context where appropriate",
              "Build hosting confidence"
            ]
          },
          points: 15
        },
        22: {
          title: "Waiata Description",
          description: "Listen to a new waiata Māori and describe what it's about to a friend or whānau member.",
          type: "learning",
          content: {
            cultural_context: "Analyzing waiata develops listening skills while deepening cultural understanding.",
            facts: [
              "Listen multiple times for understanding",
              "Research the waiata's background",
              "Practice descriptive vocabulary",
              "Share cultural knowledge"
            ]
          },
          points: 15
        },
        23: {
          title: "Persuasive Kōrero",
          description: "Write a short persuasive kōrero in te reo Māori about why people in Aotearoa should learn the language. Share it with a friend.",
          type: "learning",
          content: {
            cultural_context: "Advocating for te reo Māori builds persuasive skills while promoting language revitalization.",
            facts: [
              "Use compelling arguments",
              "Include cultural and practical benefits",
              "Practice persuasive language structures",
              "Share with passion and respect"
            ]
          },
          points: 15
        },
        24: {
          title: "Te Reo To-Do List",
          description: "Write a to-do list in te reo Māori with at least 5 items on it, using new vocabulary you're learning in each item.",
          type: "learning",
          content: {
            cultural_context: "Using te reo Māori for practical tasks integrates the language into daily life organization.",
            facts: [
              "Include diverse daily activities",
              "Use action verbs and new vocabulary",
              "Practice task-oriented language",
              "Make it practical and useful"
            ]
          },
          points: 15
        },
        25: {
          title: "Household Narration",
          description: "Narrate your actions out loud in te reo Māori as you do a chore around the house or marae.",
          type: "learning",
          content: {
            cultural_context: "Narrating actions builds fluency while making routine tasks into learning opportunities.",
            facts: [
              "Describe each step of your actions",
              "Use present tense markers",
              "Include tool and process vocabulary",
              "Practice natural flow"
            ]
          },
          points: 15
        },
        26: {
          title: "Passive Voice Practice",
          description: "Rewrite your 6 sentences from Day 7 using rerehāngū (passive voice). If you used rerehāngū in your original sentences, change it to reremahi (active voice).",
          type: "learning",
          content: {
            cultural_context: "Understanding active and passive voice allows for more sophisticated grammatical expression.",
            facts: [
              "Practice voice transformation",
              "Understand when to use each voice",
              "Build grammatical flexibility",
              "Compare different structures"
            ]
          },
          points: 15
        },
        27: {
          title: "Tongue Twister Mastery",
          description: "Find a new whīwhiwhi (reo Māori tongue twister) and practice saying it out loud until you can do it without any pronunciation errors.",
          type: "learning",
          content: {
            cultural_context: "Tongue twisters improve pronunciation accuracy and build confidence with difficult sound combinations.",
            facts: [
              "Start slowly and build speed",
              "Focus on clear pronunciation",
              "Practice until natural",
              "Enjoy the pronunciation challenge"
            ]
          },
          points: 15
        },
        28: {
          title: "Social Media Translation",
          description: "Translate an old social media post or message to a friend into te reo Māori.",
          type: "learning",
          content: {
            cultural_context: "Translating personal content helps adapt te reo Māori to modern digital communication.",
            facts: [
              "Choose meaningful personal content",
              "Adapt cultural context appropriately",
              "Use modern te reo Māori expressions",
              "Practice digital communication skills"
            ]
          },
          points: 15
        },
        29: {
          title: "30-Minute Te Reo Time",
          description: "Schedule a 30-minute slot today where you will only speak te reo Māori. Don't be afraid to use the kaupapa card on the Mahuru website to let others know what you're doing.",
          type: "learning",
          content: {
            cultural_context: "Extended immersive practice develops true conversational fluency and confidence.",
            facts: [
              "Plan diverse conversation topics",
              "Use available resources for support",
              "Focus on communication over perfection",
              "Celebrate your extended effort"
            ]
          },
          points: 15
        },
        30: {
          title: "Future Planning",
          description: "Post in the Mahuru Māori Facebook group how you're going to continue to grow your reo after Mahuru – or, if you're not on social media, message a friend or whānau member to help keep you accountable.",
          type: "learning",
          content: {
            cultural_context: "Committing to continued learning ensures language growth continues beyond formal challenges.",
            facts: [
              "Set realistic continuing goals",
              "Find accountability partners",
              "Plan specific learning activities",
              "Celebrate your progress so far"
            ]
          },
          points: 15
        }
      },
      advanced: {
        1: {
          title: "Kaupapa Brainstorming",
          description: "Brainstorm a list of 5 ways to tell people who don't speak te reo Māori about the Mahuru Challenge kaupapa.",
          type: "learning",
          content: {
            cultural_context: "Effectively communicating the value of te reo Māori challenges to non-speakers builds understanding and support.",
            facts: [
              "Consider different audiences and approaches",
              "Use both emotional and practical appeals",
              "Include cultural significance and benefits",
              "Develop clear, compelling messaging"
            ]
          },
          points: 30
        },
        2: {
          title: "Leading Karakia",
          description: "Lead karakia at home or at work today.",
          type: "learning",
          content: {
            cultural_context: "Leading karakia demonstrates cultural leadership and brings spiritual grounding to communities.",
            facts: [
              "Choose appropriate karakia for the context",
              "Lead with confidence and cultural sensitivity",
              "Explain the purpose to participants",
              "Create inclusive spiritual moments"
            ]
          },
          points: 30
        },
        3: {
          title: "English-Free Lunch",
          description: "Eat lunch today with other people who kōrero Māori and try not to speak any English.",
          type: "learning",
          content: {
            cultural_context: "Immersive social experiences build natural conversation skills and cultural confidence.",
            facts: [
              "Find other te reo Māori speakers",
              "Commit to full immersion",
              "Support each other's efforts",
              "Use natural conversation topics"
            ]
          },
          points: 30
        },
        4: {
          title: "Whaikōrero Analysis",
          description: "Listen to a recording of a political speech or whaikōrero and identify rhetorical devices used.",
          type: "learning",
          content: {
            cultural_context: "Understanding rhetorical techniques in whaikōrero develops appreciation for oratory traditions.",
            facts: [
              "Identify metaphors and imagery",
              "Notice structural patterns",
              "Understand cultural references",
              "Analyze persuasive techniques"
            ]
          },
          points: 30
        },
        5: {
          title: "Hapa Reo Solutions",
          description: "Identify a common hapa reo and develop a tip or trick to avoid it. Share what you've learned with your mates!",
          type: "learning",
          content: {
            cultural_context: "Identifying and correcting language errors helps maintain accuracy and teaches others.",
            facts: [
              "Choose a common mistake you've observed",
              "Develop practical memory aids",
              "Share educational tips with others",
              "Build language accuracy awareness"
            ]
          },
          points: 30
        },
        6: {
          title: "Karapipiti Creation",
          description: "Write your karapipiti or pepeha whakanikoniko and share it with your whānau. You can use the Mahuru website as a resource.",
          type: "learning",
          content: {
            cultural_context: "Creating detailed pepeha establishes deep cultural identity and connection to place.",
            facts: [
              "Include all significant geographical connections",
              "Use poetic and meaningful language",
              "Connect to ancestral references",
              "Share with appropriate cultural context"
            ]
          },
          points: 30
        },
        7: {
          title: "Tikanga Comparison",
          description: "Talk to someone from a different marae. Find one common tikanga and one that differs between your marae.",
          type: "learning",
          content: {
            cultural_context: "Understanding regional variations in tikanga demonstrates the diversity within Māori culture.",
            facts: [
              "Approach with respect and curiosity",
              "Ask appropriate questions about practices",
              "Share your own marae's tikanga",
              "Build understanding of cultural diversity"
            ]
          },
          points: 30
        },
        8: {
          title: "Kīwaha Challenge",
          description: "See how many kīwaha you can use in conversation today.",
          type: "learning",
          content: {
            cultural_context: "Using multiple kīwaha demonstrates advanced cultural fluency and natural expression.",
            facts: [
              "Choose contextually appropriate expressions",
              "Use with native speakers when possible",
              "Maintain natural conversation flow",
              "Practice advanced cultural expression"
            ]
          },
          points: 30
        },
        9: {
          title: "Extended Reading",
          description: "Find a book or website written entirely in te reo Māori. See how much you can read in the next week.",
          type: "learning",
          content: {
            cultural_context: "Extended reading in te reo Māori builds comprehension and exposes learners to sophisticated language use.",
            facts: [
              "Choose material at appropriate difficulty",
              "Set realistic daily reading goals",
              "Take notes on new vocabulary",
              "Discuss content with other learners"
            ]
          },
          points: 30
        },
        10: {
          title: "Cooking Demo",
          description: "Create a cooking demo entirely in te reo Māori. Record yourself giving instructions as you cook your favourite kai.",
          type: "learning",
          content: {
            cultural_context: "Teaching practical skills in te reo Māori demonstrates its functionality in everyday activities.",
            facts: [
              "Plan your instructions beforehand",
              "Use cooking and food vocabulary",
              "Include cultural context about ingredients",
              "Create a useful learning resource"
            ]
          },
          points: 30
        },
        11: {
          title: "Reo Journey Story",
          description: "Write a poem or short story about your journey learning and speaking te reo Māori.",
          type: "learning",
          content: {
            cultural_context: "Creative expression in te reo Māori demonstrates advanced language use and personal reflection.",
            facts: [
              "Use creative language techniques",
              "Include personal experiences and emotions",
              "Practice advanced vocabulary and structures",
              "Share your cultural journey"
            ]
          },
          points: 30
        },
        12: {
          title: "News Analysis",
          description: "Watch a reo Māori news broadcast and summarise one of the stories in your own words.",
          type: "learning",
          content: {
            cultural_context: "Analyzing current affairs content builds comprehension skills with sophisticated material.",
            facts: [
              "Choose stories of interest to you",
              "Focus on main points and details",
              "Practice news vocabulary",
              "Build current affairs discussion skills"
            ]
          },
          points: 30
        },
        13: {
          title: "Whīwhiwhi Teaching",
          description: "Try out 3 whīwhiwhi and teach them to a friend, whānau member, or coworker. Practice them until you can say them easily!",
          type: "learning",
          content: {
            cultural_context: "Tongue twisters are fun cultural elements that improve pronunciation and cultural engagement.",
            facts: [
              "Master pronunciation before teaching",
              "Explain cultural significance",
              "Make learning fun and engaging",
              "Build pronunciation skills"
            ]
          },
          points: 30
        },
        14: {
          title: "Formal Letter Writing",
          description: "Write a formal letter or submission entirely in te reo Māori about a subject you're passionate about.",
          type: "learning",
          content: {
            cultural_context: "Formal writing demonstrates advanced language skills and cultural confidence in official contexts.",
            facts: [
              "Use appropriate formal language structures",
              "Include proper cultural protocols",
              "Address important issues thoughtfully",
              "Practice official communication skills"
            ]
          },
          points: 30
        },
        15: {
          title: "Movie Description Game",
          description: "Describe your favourite movie or TV show in te reo Māori to a friend without giving away its name and see if they can guess which one you're talking about.",
          type: "learning",
          content: {
            cultural_context: "Descriptive games build creative language use while maintaining cultural engagement.",
            facts: [
              "Use descriptive vocabulary creatively",
              "Avoid obvious identifying words",
              "Practice plot and character description",
              "Make it fun and interactive"
            ]
          },
          points: 30
        },
        16: {
          title: "Cultural Tour",
          description: "Take a friend on a tour of a place that's important to you. Try to speak as little English as you can during the tour.",
          type: "learning",
          content: {
            cultural_context: "Sharing important places in te reo Māori builds cultural connections and practical skills.",
            facts: [
              "Prepare location-specific vocabulary",
              "Share cultural significance appropriately",
              "Practice extended speaking",
              "Build cultural sharing confidence"
            ]
          },
          points: 30
        },
        17: {
          title: "Dialect Analysis",
          description: "Listen to kōrero from a different reo Māori dialect and note the differences in their speech.",
          type: "learning",
          content: {
            cultural_context: "Understanding dialectal differences demonstrates appreciation for regional language variations.",
            facts: [
              "Listen carefully to pronunciation differences",
              "Note vocabulary variations",
              "Respect regional language traditions",
              "Build linguistic awareness"
            ]
          },
          points: 30
        },
        18: {
          title: "Storytelling Challenge",
          description: "Tell a story using as many kīwaha, whakataukī, and kupu whakarite/kupu whakaniko as you can. Challenge a friend to do the same and see who can use more.",
          type: "learning",
          content: {
            cultural_context: "Advanced storytelling showcases sophisticated cultural and linguistic knowledge.",
            facts: [
              "Prepare cultural expressions beforehand",
              "Use them naturally within narrative",
              "Make it a fun competition",
              "Demonstrate advanced cultural fluency"
            ]
          },
          points: 30
        },
        19: {
          title: "Te Matatini Commentary",
          description: "Share a performance from this year's Te Matatini and describe in te reo Māori why it was impactful for you. You can find videos of the performances online or on demand.",
          type: "learning",
          content: {
            cultural_context: "Analyzing cultural performances builds appreciation and critical thinking skills in te reo Māori.",
            facts: [
              "Choose a performance that moved you",
              "Use evaluative and emotional vocabulary",
              "Discuss cultural and artistic elements",
              "Share cultural analysis skills"
            ]
          },
          points: 30
        },
        20: {
          title: "News Translation",
          description: "Pick a news story today and try translating it into te reo Māori.",
          type: "learning",
          content: {
            cultural_context: "Translating current affairs demonstrates advanced language skills and cultural adaptation.",
            facts: [
              "Choose appropriate news content",
              "Adapt cultural context appropriately",
              "Use sophisticated vocabulary",
              "Practice professional translation skills"
            ]
          },
          points: 30
        },
        21: {
          title: "Rhyming Email",
          description: "Write an email to a friend or whānau member using only rhyming phrases in te reo Māori.",
          type: "learning",
          content: {
            cultural_context: "Creative language use demonstrates playfulness and advanced linguistic skills.",
            facts: [
              "Plan rhyming patterns beforehand",
              "Maintain meaning while rhyming",
              "Use creative vocabulary",
              "Make communication fun and engaging"
            ]
          },
          points: 30
        },
        22: {
          title: "Language Philosophy Debate",
          description: "If a kupu Māori is loaned or transliterated from English, does that make it 'less' Māori? Have a debate in te reo Māori with a friend, whānau member, or coworker.",
          type: "learning",
          content: {
            cultural_context: "Philosophical discussions about language demonstrate critical thinking and cultural analysis.",
            facts: [
              "Consider both sides of the argument",
              "Use sophisticated reasoning vocabulary",
              "Discuss language evolution and identity",
              "Build debate skills in te reo Māori"
            ]
          },
          points: 30
        },
        23: {
          title: "Fictional Obituary",
          description: "Write an obituary for a fictional character in te reo Māori.",
          type: "learning",
          content: {
            cultural_context: "Creative writing exercises build advanced vocabulary and cultural understanding of life celebrations.",
            facts: [
              "Use appropriate honorific language",
              "Include cultural elements respectfully",
              "Practice formal commemorative writing",
              "Build advanced writing skills"
            ]
          },
          points: 30
        },
        24: {
          title: "Speaker Style Analysis",
          description: "Watch kōrero from two well-known speakers of te reo Māori and compare and contrast their speaking styles. Which one is more appealing to you?",
          type: "learning",
          content: {
            cultural_context: "Analyzing speaking styles builds appreciation for oratory traditions and personal preferences.",
            facts: [
              "Notice rhetorical techniques",
              "Compare delivery styles",
              "Identify personal preferences",
              "Build critical listening skills"
            ]
          },
          points: 30
        },
        25: {
          title: "Supporting Struggling Learners",
          description: "What are 3 things you can do to help people who might be struggling to learn and speak te reo Māori? Try to do all 3 today.",
          type: "learning",
          content: {
            cultural_context: "Supporting other learners builds community and demonstrates cultural leadership.",
            facts: [
              "Identify specific support strategies",
              "Offer encouragement and resources",
              "Share your learning experiences",
              "Build supportive learning communities"
            ]
          },
          points: 30
        },
        26: {
          title: "Persuasive Advertisement",
          description: "Create an advertisement in te reo Māori for a product or service that you love. Be persuasive!",
          type: "learning",
          content: {
            cultural_context: "Creating advertisements demonstrates advanced persuasive language and cultural adaptation.",
            facts: [
              "Use compelling persuasive techniques",
              "Adapt marketing concepts culturally",
              "Practice commercial vocabulary",
              "Build advanced persuasive skills"
            ]
          },
          points: 30
        },
        27: {
          title: "Poetry Analysis",
          description: "Read a poem in te reo Māori. What language elements can you find?",
          type: "learning",
          content: {
            cultural_context: "Literary analysis builds appreciation for poetic traditions and advanced language techniques.",
            facts: [
              "Identify metaphors and imagery",
              "Notice rhythm and sound patterns",
              "Understand cultural references",
              "Build literary appreciation skills"
            ]
          },
          points: 30
        },
        28: {
          title: "News Language Comparison",
          description: "Find two news stories about the same event, one in te reo Māori and one in te reo Pākehā. Note the key differences in the type of language used and explain it to a friend or whānau member.",
          type: "learning",
          content: {
            cultural_context: "Comparing language use across cultures builds understanding of linguistic and cultural differences.",
            facts: [
              "Compare vocabulary choices",
              "Notice cultural framing differences",
              "Analyze structural variations",
              "Build comparative language skills"
            ]
          },
          points: 30
        },
        29: {
          title: "Letter to Tūpuna",
          description: "Write a letter to one of your tūpuna explaining how the use of te reo Māori has changed in Aotearoa in the past 10 years.",
          type: "learning",
          content: {
            cultural_context: "Connecting with ancestors through language demonstrates deep cultural understanding and personal reflection.",
            facts: [
              "Use respectful ancestral address",
              "Discuss language revitalization progress",
              "Include personal and societal changes",
              "Practice formal ancestral communication"
            ]
          },
          points: 30
        },
        30: {
          title: "Future Planning",
          description: "Post in the Mahuru Māori Facebook group how you're going to continue to grow your reo after Mahuru – or, if you're not on social media, message a friend or whānau member to help keep you accountable.",
          type: "learning",
          content: {
            cultural_context: "Committing to continued learning ensures language growth continues beyond formal challenges.",
            facts: [
              "Set realistic continuing goals",
              "Find accountability partners",
              "Plan specific learning activities",
              "Celebrate your progress so far"
            ]
          },
          points: 30
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
