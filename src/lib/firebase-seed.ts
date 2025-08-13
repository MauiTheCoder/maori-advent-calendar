import { doc, setDoc } from 'firebase/firestore'
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