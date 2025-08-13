import { doc, setDoc, collection, getDocs, addDoc } from 'firebase/firestore'
import { db } from './firebase'
import { User } from './firebase-auth'

export const ensureUserProfile = async (
  uid: string,
  email: string,
  displayName?: string
): Promise<User> => {
  const profile: User = {
    id: uid,
    email,
    name: displayName || email.split('@')[0],
    character_id: null,
    difficulty_level: null,
    current_day: 1,
    total_points: 0,
    achievements: [],
    completed_days: [],
    email_verified: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  await setDoc(doc(db, 'users', uid), profile)
  return profile
}

export const needsSeeding = async (): Promise<boolean> => {
  try {
    const charactersSnapshot = await getDocs(collection(db, 'characters'))
    return charactersSnapshot.empty
  } catch (error) {
    console.error('Error checking if database needs seeding:', error)
    return false
  }
}

export const seedDatabase = async (): Promise<void> => {
  try {
    // Check if characters already exist
    const charactersSnapshot = await getDocs(collection(db, 'characters'))
    if (!charactersSnapshot.empty) {
      console.log('Database already seeded')
      return
    }

    // Seed characters
    const characters = [
      {
        name: 'Tāne Mahuta',
        description: 'God of forests and birds',
        image_url: '/characters/tane.jpg',
        cultural_significance: 'Guardian of nature and wildlife',
        created_at: new Date().toISOString()
      },
      {
        name: 'Tangaroa',
        description: 'God of the sea',
        image_url: '/characters/tangaroa.jpg',
        cultural_significance: 'Guardian of the oceans and marine life',
        created_at: new Date().toISOString()
      }
    ]

    for (const character of characters) {
      await addDoc(collection(db, 'characters'), character)
    }

    console.log('Database seeded successfully')
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}

export const reseedWithKaitiaki = async (): Promise<void> => {
  try {
    console.log('Reseeding with Kaitiaki characters...')
    // This function can be implemented later if needed
    await seedDatabase()
  } catch (error) {
    console.error('Error reseeding with Kaitiaki:', error)
    throw error
  }
}