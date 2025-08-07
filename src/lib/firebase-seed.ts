import { collection, doc, setDoc, writeBatch, getDocs, query, limit, deleteDoc } from 'firebase/firestore'
import { db } from './firebase'
import { Character, Activity, User } from './firebase-auth'

// Function to create a user profile if missing
export async function ensureUserProfile(userId: string, email: string, displayName?: string): Promise<User> {
  try {
    const userDocRef = doc(db, 'users', userId)
    const userProfile = {
      id: userId,
      email: email,
      name: displayName || 'User',
      current_day: 1,
      total_points: 0,
      difficulty_level: null as 'beginner' | 'intermediate' | 'advanced' | null,
      character_id: null,
      email_verified: false,
      achievements: [] as string[],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    await setDoc(userDocRef, userProfile, { merge: true })
    console.log('✅ User profile created/updated for:', email)
    return userProfile
  } catch (error) {
    console.error('❌ Error creating user profile:', error)
    throw error
  }
}

// Character seed data - 3 Kaitiaki Guardians with difficulty levels
const seedCharacters: Omit<Character, 'id' | 'created_at'>[] = [
  {
    name: "Kiwi (Beginner Kaitiaki)",
    description: "Gentle ground-dwelling guardian, perfect for cultural newcomers",
    image_url: "/images/kiwi.jpg",
    cultural_significance: "The Kiwi is Aotearoa's most beloved native bird and national symbol. Known for its humble nature and strong family bonds, the Kiwi represents the perfect starting point for your cultural journey. As a flightless bird that thrives through determination and unique adaptation, Kiwi will guide beginners through foundational Māori concepts with patience and encouragement. The Kiwi teaches us that strength comes not from size or speed, but from persistence, humility, and staying connected to whenua (the land)."
  },
  {
    name: "Pūkeko (Intermediate Kaitiaki)",
    description: "Intelligent wetland guardian for deeper cultural exploration",
    image_url: "/images/pukeko.jpg",
    cultural_significance: "The Pūkeko is a striking purple swamphen known for its intelligence, adaptability, and strong community bonds. Living in the sacred wetlands that connect land and water, Pūkeko represents the bridge between basic and advanced knowledge. As your intermediate guide, Pūkeko will help you navigate more complex cultural concepts, teaching you about the interconnectedness of all living things and the importance of community (whānau). The Pūkeko's ability to thrive in both water and land environments mirrors your growing ability to move between different aspects of Māori culture with confidence."
  },
  {
    name: "Tui (Advanced Kaitiaki)",
    description: "Master songbird and keeper of complex cultural wisdom",
    image_url: "/images/tui.jpg",
    cultural_significance: "The Tui is revered as one of Aotearoa's most intelligent and melodious birds, capable of complex songs and even mimicking human speech. With its distinctive white throat feathers and beautiful iridescent plumage, the Tui represents the pinnacle of cultural understanding. As your advanced guide, Tui will lead you through the most sophisticated aspects of Māori worldview, including complex spiritual concepts, advanced language nuances, and deep cultural philosophies. The Tui's mastery of communication and song reflects your journey toward becoming a skilled practitioner and guardian of Māori knowledge yourself."
  }
]

// Sample activities for different difficulty levels
const sampleActivities: Omit<Activity, 'id' | 'created_at' | 'updated_at' | 'unlock_date'>[] = [
  // Day 1 activities for all difficulty levels
  {
    day: 1,
    title: "Kia Ora - First Greetings",
    description: "Learn the most important Māori greeting",
    type: "learning",
    difficulty: "beginner",
    content: {
      cultural_context: "Kia ora is more than just 'hello' - it means 'be well' or 'be healthy'. It's a wish for wellbeing.",
      facts: [
        "Kia ora literally translates to 'be well' or 'be healthy'",
        "It can be used for hello, goodbye, thank you, and good luck",
        "The response to 'Kia ora' is also 'Kia ora'",
        "It comes from the word 'ora' meaning life, health, or vitality"
      ],
      story: "When Captain James Cook first arrived in Aotearoa, Māori greeted his crew with 'Kia ora!' - a blessing of health and wellbeing for the strangers."
    },
    points: 10
  },
  {
    day: 1,
    title: "Kia Ora Customs - Cultural Greetings",
    description: "Explore the deeper meanings behind Māori greetings",
    type: "learning",
    difficulty: "intermediate",
    content: {
      cultural_context: "Kia ora carries spiritual significance beyond a simple greeting. It's a blessing that acknowledges the life force (mauri) in all people and places.",
      facts: [
        "Kia ora connects to the concept of mauri - life force or vital essence",
        "Different greetings are used for different times and situations",
        "The tone and context change the spiritual weight of the greeting",
        "Traditional responses show understanding of Māori worldview"
      ]
    },
    points: 15
  },
  {
    day: 1,
    title: "Kia Ora - Philosophical Foundations",
    description: "Deep dive into the metaphysical dimensions of Māori greetings",
    type: "learning",
    difficulty: "advanced",
    content: {
      cultural_context: "Kia ora represents a complex philosophical framework that encompasses whakapapa (genealogical connections), mauri (life essence), and the interconnectedness of all existence within Te Ao Māori.",
      facts: [
        "Kia ora activates whakapapa connections between people and place",
        "The greeting acknowledges the atua (spiritual forces) present in all interactions",
        "Historical variations include formal and ceremonial applications",
        "Contemporary usage maintains spiritual significance in secular contexts"
      ]
    },
    points: 20
  },
  // Day 2 Quiz examples
  {
    day: 2,
    title: "Māori Numbers Quiz",
    description: "Test your knowledge of Māori numbers 1-10",
    type: "quiz",
    difficulty: "beginner",
    content: {
      question: "What is the Māori word for 'three'?",
      options: ["tahi", "rua", "toru", "whā"],
      correct: 2,
      explanation: "Toru means 'three' in Māori. The numbers 1-5 are: tahi (1), rua (2), toru (3), whā (4), rima (5)."
    },
    points: 10
  }
]

// Function to clear existing characters
export const clearCharacters = async (): Promise<void> => {
  try {
    console.log('Clearing existing characters from database...')

    // Get all existing characters
    const charactersSnapshot = await getDocs(collection(db, 'characters'))

    if (charactersSnapshot.empty) {
      console.log('No existing characters to clear.')
      return
    }

    // Delete each character document
    const batch = writeBatch(db)
    charactersSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref)
    })

    await batch.commit()
    console.log(`Cleared ${charactersSnapshot.docs.length} existing characters.`)
  } catch (error) {
    console.error('Error clearing characters:', error)
    throw error
  }
}

// Function to seed the database
export const seedDatabase = async (): Promise<void> => {
  try {
    console.log('Starting database seeding with 3 Kaitiaki guardians...')

    // Seed characters
    console.log('Seeding 3 Kaitiaki guardians: Kiwi (Beginner), Pūkeko (Intermediate), Tui (Advanced)...')
    for (const characterData of seedCharacters) {
      const docRef = doc(collection(db, 'characters'))
      const character: Character = {
        id: docRef.id,
        ...characterData,
        created_at: new Date().toISOString()
      }
      await setDoc(docRef, character)
    }

    // Seed sample activities
    console.log('Seeding activities...')
    for (const activityData of sampleActivities) {
      const docRef = doc(collection(db, 'activities'))
      const activity: Activity = {
        id: docRef.id,
        ...activityData,
        unlock_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      await setDoc(docRef, activity)
    }

    console.log('Database seeding completed successfully with 3 Kaitiaki guardians!')
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}

// Function to clear and reseed with new Kaitiaki guardians
export const reseedWithKaitiaki = async (): Promise<void> => {
  try {
    console.log('🔄 Reseeding database with new 3 Kaitiaki guardians...')

    // Clear existing characters first
    await clearCharacters()

    // Seed new Kaitiaki guardians
    await seedDatabase()

    console.log('✅ Successfully reseeded with 3 Kaitiaki guardians!')
  } catch (error) {
    console.error('❌ Error reseeding database:', error)
    throw error
  }
}

// Function to check if database needs seeding
export const needsSeeding = async (): Promise<boolean> => {
  try {
    console.log('Checking if database needs seeding...')
    // Check if characters collection has any documents
    const charactersQuery = query(collection(db, 'characters'), limit(1))
    console.log('Created query, executing...')
    const charactersSnapshot = await getDocs(charactersQuery)
    console.log('Query executed, snapshot empty:', charactersSnapshot.empty)

    return charactersSnapshot.empty
  } catch (error) {
    console.error('Error checking if seeding is needed:', error)
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')
    return true
  }
}

// Export for manual seeding
export { seedCharacters, sampleActivities }
