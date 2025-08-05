'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { motion } from 'framer-motion'
import { Character, characters } from '@/lib/firebase-auth'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function CharacterSelectionPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  const [availableCharacters, setAvailableCharacters] = useState<Character[]>([])
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Load characters on mount
  useEffect(() => {
    const loadCharacters = async () => {
      try {
        const characterData = await characters.getAll()
        setAvailableCharacters(characterData)
      } catch (error) {
        console.error('Error loading characters:', error)
        setError('Failed to load character options. Please refresh the page.')
      }
    }

    loadCharacters()
  }, [])

  // Redirect if not authenticated or already has character
  useEffect(() => {
    if (!loading && (!user || !user.emailVerified)) {
      router.push('/')
    } else if (profile?.character_id) {
      router.push('/dashboard')
    }
  }, [user, profile, loading, router])

  const handleCharacterSelect = async () => {
    if (!selectedCharacter || !user) return

    setIsLoading(true)
    setError('')

    try {
      // Update user profile with selected character
      await updateDoc(doc(db, 'users', user.uid), {
        character_id: selectedCharacter.id,
        updated_at: new Date().toISOString()
      })

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Error selecting character:', error)
      setError('Failed to select character. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getCharacterEmoji = (character: Character): string => {
    if (character.name.includes('Kiwi')) return '🥝'
    if (character.name.includes('Pūkeko')) return '🦆'
    if (character.name.includes('Tui')) return '🐦'
    return '🌿' // Fallback
  }

  const getDifficultyBadge = (character: Character): { level: string; color: string } => {
    if (character.name.includes('Beginner') || character.name.includes('Kiwi')) {
      return { level: 'Beginner', color: 'bg-green-100 text-green-800 border-green-200' }
    }
    if (character.name.includes('Intermediate') || character.name.includes('Pūkeko')) {
      return { level: 'Intermediate', color: 'bg-blue-100 text-blue-800 border-blue-200' }
    }
    if (character.name.includes('Advanced') || character.name.includes('Tui')) {
      return { level: 'Advanced', color: 'bg-purple-100 text-purple-800 border-purple-200' }
    }
    return { level: 'Cultural Guide', color: 'bg-gray-100 text-gray-800 border-gray-200' }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg">Loading...</span>
        </div>
      </div>
    )
  }

  if (!user || !user.emailVerified) {
    return null // Will redirect
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
                <p className="text-sm text-muted-foreground">Choose Your Kaitiaki Guardian</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              Welcome, {user.displayName || user.email}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">
            Choose Your <span className="text-primary">Kaitiaki Guardian</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Select your cultural guardian based on your learning preference. Each Kaitiaki represents a different
            level of cultural complexity and will guide you through your 30-day journey with appropriate depth.
          </p>
        </motion.div>

        {error && (
          <Alert className="border-red-200 bg-red-50 mb-8 max-w-2xl mx-auto">
            <AlertDescription className="text-red-600">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {availableCharacters.map((character, index) => {
            const difficulty = getDifficultyBadge(character)
            return (
              <motion.div
                key={character.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`cultural-card cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                    selectedCharacter?.id === character.id
                      ? 'ring-2 ring-primary border-primary shadow-lg scale-105'
                      : ''
                  }`}
                  onClick={() => setSelectedCharacter(character)}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <span className="text-2xl text-primary-foreground font-bold">
                          {getCharacterEmoji(character)}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-center mb-2">
                      <Badge className={`${difficulty.color} border`}>
                        {difficulty.level}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mb-2">{character.name}</CardTitle>
                    <CardDescription className="text-center">
                      {character.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-secondary/50 rounded-lg">
                        <h4 className="font-semibold text-sm text-primary mb-2">Cultural Significance</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {character.cultural_significance}
                        </p>
                      </div>

                      {selectedCharacter?.id === character.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="pt-2"
                        >
                          <Badge className="w-full justify-center bg-primary text-primary-foreground">
                            ✓ Selected as Your Kaitiaki
                          </Badge>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {selectedCharacter && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-center"
          >
            <Card className="cultural-card max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-lg">Ready to Begin?</CardTitle>
                <CardDescription>
                  {selectedCharacter.name} will be your guide throughout your cultural journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleCharacterSelect}
                  disabled={isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                      <span>Confirming Selection...</span>
                    </div>
                  ) : (
                    `Start Journey with ${selectedCharacter.name.split(' ')[0]}`
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
