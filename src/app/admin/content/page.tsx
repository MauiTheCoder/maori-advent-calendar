'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdmin, useAdminPermissions } from '@/hooks/useAdmin'
import { useCMSContent } from '@/hooks/useCMS'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface ContentSection {
  id: string
  name: string
  description: string
  items: ContentItem[]
}

interface ContentItem {
  key: string
  label: string
  type: 'text' | 'textarea' | 'color' | 'url'
  value: string | number | boolean
  placeholder?: string
  description?: string
}

export default function ContentManagement() {
  const router = useRouter()
  const { isAdmin, loading: adminLoading } = useAdmin()
  const permissions = useAdminPermissions()
  const { content, loading: contentLoading, updateContent } = useCMSContent()
  
  const [editingContent, setEditingContent] = useState<Record<string, string | number | boolean>>({})
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!adminLoading && (!isAdmin || !permissions.canEditContent)) {
      router.push('/admin/dashboard')
    }
  }, [isAdmin, adminLoading, permissions.canEditContent, router])

  // Define content sections and their editable fields
  const contentSections: ContentSection[] = [
    {
      id: 'homepage',
      name: 'Homepage Content',
      description: 'Main landing page text and headings',
      items: [
        {
          key: 'site_title',
          label: 'Site Title',
          type: 'text',
          value: content['site_title']?.value || 'Mahuru Activation 2025',
          placeholder: 'Mahuru Activation 2025',
          description: 'Main site title displayed in header'
        },
        {
          key: 'site_subtitle',
          label: 'Site Subtitle',
          type: 'text',
          value: content['site_subtitle']?.value || '30-Day Te Reo Māori Challenge',
          placeholder: '30-Day Te Reo Māori Challenge',
          description: 'Subtitle shown below main title'
        },
        {
          key: 'hero_heading',
          label: 'Hero Heading',
          type: 'text',
          value: content['hero_heading']?.value || 'Kia Ora!\nMaster Te Reo Māori',
          placeholder: 'Kia Ora!\nMaster Te Reo Māori'
        },
        {
          key: 'hero_description',
          label: 'Hero Description',
          type: 'textarea',
          value: content['hero_description']?.value || 'Join the Mahuru Challenge! Participate in 30 days of progressive te reo Māori activation activities. From beginner pronunciation to advanced conversation, strengthen your reo Māori journey with daily challenges and expert guidance.',
          placeholder: 'Hero section description text'
        },
        {
          key: 'signup_title',
          label: 'Signup Form Title',
          type: 'text',
          value: content['signup_title']?.value || 'Begin Your Cultural Journey',
          placeholder: 'Begin Your Cultural Journey'
        },
        {
          key: 'signup_description',
          label: 'Signup Form Description',
          type: 'textarea',
          value: content['signup_description']?.value || 'Create your account and choose your skill level to begin the Mahuru Challenge',
          placeholder: 'Signup form description'
        }
      ]
    },
    {
      id: 'features',
      name: 'Feature Highlights',
      description: 'Key features and benefits displayed on homepage',
      items: [
        {
          key: 'feature_1_title',
          label: 'Feature 1: Title',
          type: 'text',
          value: content['feature_1_title']?.value || 'Daily Language Activation',
          placeholder: 'Daily Language Activation'
        },
        {
          key: 'feature_2_title',
          label: 'Feature 2: Title',
          type: 'text',
          value: content['feature_2_title']?.value || 'Progressive Skill Building',
          placeholder: 'Progressive Skill Building'
        },
        {
          key: 'feature_3_title',
          label: 'Feature 3: Title',
          type: 'text',
          value: content['feature_3_title']?.value || 'Pronunciation & Conversation',
          placeholder: 'Pronunciation & Conversation'
        },
        {
          key: 'feature_4_title',
          label: 'Feature 4: Title',
          type: 'text',
          value: content['feature_4_title']?.value || 'Expert Reo Māori Guidance',
          placeholder: 'Expert Reo Māori Guidance'
        },
        {
          key: 'feature_5_title',
          label: 'Feature 5: Title',
          type: 'text',
          value: content['feature_5_title']?.value || 'Skill Level Progression',
          placeholder: 'Skill Level Progression'
        },
        {
          key: 'feature_6_title',
          label: 'Feature 6: Title',
          type: 'text',
          value: content['feature_6_title']?.value || 'Real-time Sync Across Devices',
          placeholder: 'Real-time Sync Across Devices'
        }
      ]
    },
    {
      id: 'about',
      name: 'About Section',
      description: 'Information about the platform and organization',
      items: [
        {
          key: 'about_title',
          label: 'About Section Title',
          type: 'text',
          value: content['about_title']?.value || 'Mahuru Te Reo Māori Activation Platform',
          placeholder: 'Mahuru Te Reo Māori Activation Platform'
        },
        {
          key: 'about_description',
          label: 'About Description',
          type: 'textarea',
          value: content['about_description']?.value || 'This authentic te reo Māori learning platform is designed in partnership with Te Wānanga o Aotearoa. Participate in the annual Mahuru Challenge with structured daily activities that build your confidence and fluency in te reo Māori through practical, real-world applications.',
          placeholder: 'About section description'
        },
        {
          key: 'footer_badge',
          label: 'Footer Badge Text',
          type: 'text',
          value: content['footer_badge']?.value || '🌿 Mahuru 2025 • Progressive Learning • Te Wānanga o Aotearoa',
          placeholder: 'Footer badge text'
        }
      ]
    },
    {
      id: 'activity',
      name: 'Activity Page Content',
      description: 'Text displayed on individual activity pages',
      items: [
        {
          key: 'activity_tips_title',
          label: 'Tips Section Title',
          type: 'text',
          value: content['activity_tips_title']?.value || '💡 Helpful Tips',
          placeholder: '💡 Helpful Tips'
        },
        {
          key: 'activity_tips_1',
          label: 'Tip 1',
          type: 'text',
          value: content['activity_tips_1']?.value || 'Take your time and practice at your own pace',
          placeholder: 'First helpful tip'
        },
        {
          key: 'activity_tips_2',
          label: 'Tip 2',
          type: 'text',
          value: content['activity_tips_2']?.value || 'Use the Mahuru website resources for additional support',
          placeholder: 'Second helpful tip'
        },
        {
          key: 'activity_tips_3',
          label: 'Tip 3',
          type: 'text',
          value: content['activity_tips_3']?.value || 'Share your progress with whānau and friends',
          placeholder: 'Third helpful tip'
        },
        {
          key: 'activity_tips_4',
          label: 'Tip 4',
          type: 'text',
          value: content['activity_tips_4']?.value || 'Remember: kia kaha (be strong) in your learning journey!',
          placeholder: 'Fourth helpful tip'
        },
        {
          key: 'completion_message',
          label: 'Completion Message',
          type: 'text',
          value: content['completion_message']?.value || 'Ka pai! Well done!',
          placeholder: 'Ka pai! Well done!'
        }
      ]
    }
  ]

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

  const handleInputChange = (key: string, value: string | number | boolean) => {
    setEditingContent(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSaveSection = async (sectionId: string) => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const section = contentSections.find(s => s.id === sectionId)
      if (!section) return

      // Save all items in this section
      const promises = section.items.map(item => {
        const newValue = editingContent[item.key] !== undefined 
          ? editingContent[item.key] 
          : item.value

        return updateContent(item.key, newValue, {
          section: sectionId,
          label: item.label,
          type: item.type
        })
      })

      await Promise.all(promises)
      setSuccess(`${section.name} updated successfully!`)
      setEditingContent({})

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error saving content:', error)
      setError('Failed to save content. Please try again.')
    } finally {
      setSaving(false)
    }
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
                <h1 className="text-2xl font-bold">Content Management</h1>
                <p className="text-sm text-muted-foreground">Edit site text and content</p>
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

        <div className="space-y-8">
          {contentSections.map((section, sectionIndex) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{section.name}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {section.items.map((item) => (
                    <div key={item.key} className="space-y-2">
                      <Label htmlFor={item.key}>
                        {item.label}
                        {item.description && (
                          <span className="text-xs text-muted-foreground ml-2">
                            ({item.description})
                          </span>
                        )}
                      </Label>
                      
                      {item.type === 'textarea' ? (
                        <textarea
                          id={item.key}
                          value={editingContent[item.key] !== undefined 
                            ? editingContent[item.key] 
                            : item.value || ''
                          }
                          onChange={(e) => handleInputChange(item.key, e.target.value)}
                          placeholder={item.placeholder}
                          className="w-full p-3 border border-border rounded-md min-h-[100px] resize-vertical"
                        />
                      ) : item.type === 'color' ? (
                        <div className="flex space-x-2">
                          <Input
                            id={item.key}
                            type="color"
                            value={editingContent[item.key] !== undefined 
                              ? editingContent[item.key] 
                              : item.value || '#000000'
                            }
                            onChange={(e) => handleInputChange(item.key, e.target.value)}
                            className="w-16 h-10"
                          />
                          <Input
                            type="text"
                            value={editingContent[item.key] !== undefined 
                              ? editingContent[item.key] 
                              : item.value || ''
                            }
                            onChange={(e) => handleInputChange(item.key, e.target.value)}
                            placeholder={item.placeholder}
                            className="flex-1"
                          />
                        </div>
                      ) : (
                        <Input
                          id={item.key}
                          type={item.type === 'url' ? 'url' : 'text'}
                          value={editingContent[item.key] !== undefined 
                            ? editingContent[item.key] 
                            : item.value || ''
                          }
                          onChange={(e) => handleInputChange(item.key, e.target.value)}
                          placeholder={item.placeholder}
                        />
                      )}
                    </div>
                  ))}

                  <div className="flex justify-end pt-4 border-t">
                    <Button
                      onClick={() => handleSaveSection(section.id)}
                      disabled={saving}
                    >
                      {saving ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                          <span>Saving...</span>
                        </div>
                      ) : (
                        `Save ${section.name}`
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}