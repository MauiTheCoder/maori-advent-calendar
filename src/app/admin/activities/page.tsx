'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdmin, useAdminPermissions } from '@/hooks/useAdmin'
import { useActivities } from '@/hooks/useCMS'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ActivityContent } from '@/types/cms'

export default function ActivitiesManagement() {
  const router = useRouter()
  const { isAdmin, loading: adminLoading } = useAdmin()
  const permissions = useAdminPermissions()
  const { activities, loading: activitiesLoading, updateActivity } = useActivities()
  
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [editingActivity, setEditingActivity] = useState<ActivityContent | null>(null)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!adminLoading && (!isAdmin || !permissions.canEditActivities)) {
      router.push('/admin/dashboard')
    }
  }, [isAdmin, adminLoading, permissions.canEditActivities, router])

  if (adminLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg">Loading...</span>
        </div>
      </div>
    )
  }

  const handleEditActivity = (day: number) => {
    const activity = activities.find(a => a.day === day)
    if (activity) {
      setEditingActivity({ ...activity })
    } else {
      // Create new activity
      setEditingActivity({
        id: `day_${day}_new`, // Temporary ID for new activities
        day,
        beginner: '',
        intermediate: '',
        advanced: '',
        title: { beginner: '', intermediate: '', advanced: '' },
        points: { beginner: 10, intermediate: 15, advanced: 20 },
        tips: [],
        resources: []
      })
    }
    setSelectedDay(day)
  }

  const handleSaveActivity = async () => {
    if (!editingActivity) return

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      await updateActivity(editingActivity.day, editingActivity)
      setSuccess(`Day ${editingActivity.day} activity updated successfully!`)
      setSelectedDay(null)
      setEditingActivity(null)
    } catch (error) {
      console.error('Error saving activity:', error)
      setError('Failed to save activity. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof ActivityContent, value: string | number) => {
    setEditingActivity((prev: ActivityContent | null) => prev ? ({
      ...prev,
      [field]: value
    }) : null)
  }

  const handleNestedInputChange = (parent: string, field: string, value: string | number) => {
    setEditingActivity((prev: ActivityContent | null) => prev ? ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof ActivityContent] as Record<string, unknown> || {}),
        [field]: value
      }
    }) : null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10">
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard">
                <Button variant="outline" size="sm">
                  ← Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Activities Management</h1>
                <p className="text-sm text-muted-foreground">Edit Mahuru daily activities</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-600">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-600">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activities List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>30 Days of Mahuru</CardTitle>
                <CardDescription>
                  Click on any day to edit its activity content
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activitiesLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Loading activities...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
                      const hasActivity = activities.some(a => a.day === day)
                      const isSelected = selectedDay === day
                      
                      return (
                        <motion.button
                          key={day}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEditActivity(day)}
                          className={`
                            aspect-square rounded-lg border-2 text-sm font-medium
                            transition-all duration-200
                            ${isSelected 
                              ? 'border-primary bg-primary text-primary-foreground' 
                              : hasActivity
                                ? 'border-green-200 bg-green-50 text-green-700 hover:border-green-300'
                                : 'border-border bg-background hover:border-primary/50'
                            }
                          `}
                        >
                          {day}
                        </motion.button>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Activity Editor */}
          <div className="lg:col-span-2">
            {selectedDay ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Day {selectedDay} Activity
                    <Badge variant="outline">
                      {activities.find(a => a.day === selectedDay) ? 'Exists' : 'New'}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Edit the activity content for all difficulty levels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {editingActivity && (
                    <>
                      {/* Beginner Level */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-100 text-green-700">Beginner</Badge>
                          <span className="text-sm text-muted-foreground">10 points</span>
                        </div>
                        <div>
                          <Label htmlFor="beginner">Activity Description</Label>
                          <textarea
                            id="beginner"
                            value={editingActivity.beginner || ''}
                            onChange={(e) => handleInputChange('beginner', e.target.value)}
                            className="w-full mt-1 p-3 border border-border rounded-md min-h-[100px] resize-vertical"
                            placeholder="Enter beginner level activity description..."
                          />
                        </div>
                      </div>

                      {/* Intermediate Level */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-yellow-100 text-yellow-700">Intermediate</Badge>
                          <span className="text-sm text-muted-foreground">15 points</span>
                        </div>
                        <div>
                          <Label htmlFor="intermediate">Activity Description</Label>
                          <textarea
                            id="intermediate"
                            value={editingActivity.intermediate || ''}
                            onChange={(e) => handleInputChange('intermediate', e.target.value)}
                            className="w-full mt-1 p-3 border border-border rounded-md min-h-[100px] resize-vertical"
                            placeholder="Enter intermediate level activity description..."
                          />
                        </div>
                      </div>

                      {/* Advanced Level */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-red-100 text-red-700">Advanced</Badge>
                          <span className="text-sm text-muted-foreground">20 points</span>
                        </div>
                        <div>
                          <Label htmlFor="advanced">Activity Description</Label>
                          <textarea
                            id="advanced"
                            value={editingActivity.advanced || ''}
                            onChange={(e) => handleInputChange('advanced', e.target.value)}
                            className="w-full mt-1 p-3 border border-border rounded-md min-h-[100px] resize-vertical"
                            placeholder="Enter advanced level activity description..."
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedDay(null)
                            setEditingActivity(null)
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSaveActivity}
                          disabled={saving}
                        >
                          {saving ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                              <span>Saving...</span>
                            </div>
                          ) : (
                            'Save Activity'
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center space-y-4">
                    <span className="text-6xl">📝</span>
                    <div>
                      <h3 className="text-xl font-semibold">Select a Day to Edit</h3>
                      <p className="text-muted-foreground">
                        Choose a day from the calendar to edit its activity content
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}