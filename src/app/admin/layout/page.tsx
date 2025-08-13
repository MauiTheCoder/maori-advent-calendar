'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdmin, useAdminPermissions } from '@/hooks/useAdmin'
import { useLayoutSettings } from '@/hooks/useCMS'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface LayoutComponent {
  id: string
  name: string
  description: string
  settings: LayoutSetting[]
}

interface LayoutSetting {
  key: string
  label: string
  type: 'color' | 'text' | 'number' | 'select' | 'boolean'
  value: string | number | boolean
  options?: { label: string; value: string | number }[]
  min?: number
  max?: number
  step?: number
  unit?: string
  description?: string
}

export default function LayoutManagement() {
  const router = useRouter()
  const { isAdmin, loading: adminLoading } = useAdmin()
  const permissions = useAdminPermissions()
  const { layouts, loading: layoutsLoading, updateLayout } = useLayoutSettings()
  
  const [editingSettings, setEditingSettings] = useState<Record<string, string | number | boolean>>({})
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!adminLoading && (!isAdmin || !permissions.canEditLayout)) {
      router.push('/admin/dashboard')
    }
  }, [isAdmin, adminLoading, permissions.canEditLayout, router])

  // Define layout components and their customizable settings
  const layoutComponents: LayoutComponent[] = [
    {
      id: 'global_colors',
      name: 'Color Scheme',
      description: 'Global color palette for the entire site',
      settings: [
        {
          key: 'primary_color',
          label: 'Primary Color',
          type: 'color',
          value: layouts['global']?.styles?.colors?.primary || '#10b981',
          description: 'Main brand color used for buttons, links, and accents'
        },
        {
          key: 'secondary_color',
          label: 'Secondary Color',
          type: 'color',
          value: layouts['global']?.styles?.colors?.secondary || '#f3f4f6',
          description: 'Secondary color for backgrounds and subtle elements'
        },
        {
          key: 'accent_color',
          label: 'Accent Color',
          type: 'color',
          value: layouts['global']?.styles?.colors?.accent || '#f59e0b',
          description: 'Accent color for highlights and call-to-action elements'
        },
        {
          key: 'background_color',
          label: 'Background Color',
          type: 'color',
          value: layouts['global']?.styles?.colors?.background || '#ffffff',
          description: 'Main background color for the site'
        }
      ]
    },
    {
      id: 'typography',
      name: 'Typography',
      description: 'Font settings and text styling',
      settings: [
        {
          key: 'primary_font',
          label: 'Primary Font',
          type: 'select',
          value: layouts['global']?.styles?.fonts?.primary || 'Inter',
          options: [
            { label: 'Inter (Default)', value: 'Inter' },
            { label: 'Open Sans', value: 'Open Sans' },
            { label: 'Roboto', value: 'Roboto' },
            { label: 'Poppins', value: 'Poppins' },
            { label: 'Nunito', value: 'Nunito' },
            { label: 'Lato', value: 'Lato' }
          ],
          description: 'Main font family for headings and body text'
        },
        {
          key: 'heading_size',
          label: 'Base Heading Size',
          type: 'number',
          value: parseInt(layouts['global']?.styles?.fonts?.sizes?.heading || '32'),
          min: 24,
          max: 48,
          step: 2,
          unit: 'px',
          description: 'Base size for main headings'
        },
        {
          key: 'body_size',
          label: 'Body Text Size',
          type: 'number',
          value: parseInt(layouts['global']?.styles?.fonts?.sizes?.body || '16'),
          min: 12,
          max: 20,
          step: 1,
          unit: 'px',
          description: 'Size for regular body text'
        }
      ]
    },
    {
      id: 'spacing',
      name: 'Spacing & Layout',
      description: 'Margins, padding, and layout spacing',
      settings: [
        {
          key: 'border_radius',
          label: 'Border Radius',
          type: 'number',
          value: parseInt(layouts['global']?.styles?.borderRadius || '8'),
          min: 0,
          max: 20,
          step: 1,
          unit: 'px',
          description: 'Roundness of corners for buttons, cards, and inputs'
        },
        {
          key: 'section_spacing',
          label: 'Section Spacing',
          type: 'number',
          value: parseInt(layouts['global']?.styles?.spacing?.section || '48'),
          min: 24,
          max: 96,
          step: 8,
          unit: 'px',
          description: 'Vertical spacing between major sections'
        },
        {
          key: 'card_padding',
          label: 'Card Padding',
          type: 'number',
          value: parseInt(layouts['global']?.styles?.spacing?.card || '24'),
          min: 12,
          max: 48,
          step: 4,
          unit: 'px',
          description: 'Internal padding for cards and content boxes'
        }
      ]
    },
    {
      id: 'homepage',
      name: 'Homepage Layout',
      description: 'Layout options specific to the homepage',
      settings: [
        {
          key: 'hero_centered',
          label: 'Center Hero Content',
          type: 'boolean',
          value: layouts['homepage']?.styles?.heroCentered || false,
          description: 'Center the hero section content instead of left-aligned'
        },
        {
          key: 'show_features',
          label: 'Show Feature List',
          type: 'boolean',
          value: layouts['homepage']?.visibility?.showFeatures !== false,
          description: 'Display the feature highlights section'
        },
        {
          key: 'show_about',
          label: 'Show About Section',
          type: 'boolean',
          value: layouts['homepage']?.visibility?.showAbout !== false,
          description: 'Display the about/description section'
        }
      ]
    },
    {
      id: 'activity_page',
      name: 'Activity Pages',
      description: 'Layout settings for individual activity pages',
      settings: [
        {
          key: 'show_tips',
          label: 'Show Tips Section',
          type: 'boolean',
          value: layouts['activity']?.visibility?.showTips !== false,
          description: 'Display helpful tips on activity pages'
        },
        {
          key: 'tips_expanded',
          label: 'Expand Tips by Default',
          type: 'boolean',
          value: layouts['activity']?.styles?.tipsExpanded || false,
          description: 'Show tips section expanded by default'
        },
        {
          key: 'completion_animation',
          label: 'Completion Animation',
          type: 'boolean',
          value: layouts['activity']?.styles?.completionAnimation !== false,
          description: 'Show animated celebration when activity is completed'
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

  const handleInputChange = (componentId: string, key: string, value: string | number | boolean) => {
    setEditingSettings(prev => ({
      ...prev,
      [`${componentId}_${key}`]: value
    }))
  }

  const handleSaveComponent = async (componentId: string) => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const component = layoutComponents.find(c => c.id === componentId)
      if (!component) return

      // Build the settings object from edited values
      const settings: Record<string, unknown> = {
        component: componentId,
        styles: {},
        visibility: {}
      }

      component.settings.forEach(setting => {
        const editKey = `${componentId}_${setting.key}`
        const value = editingSettings[editKey] !== undefined 
          ? editingSettings[editKey] 
          : setting.value

        // Organize settings by type
        const styles = settings.styles as Record<string, string | number | boolean | Record<string, string>>
        const visibility = settings.visibility as Record<string, string | number | boolean>
        
        if (setting.type === 'color') {
          if (!styles.colors) styles.colors = {}
          const colors = styles.colors as Record<string, string | number | boolean>
          colors[setting.key.replace('_color', '')] = value
        } else if (setting.type === 'boolean' && setting.key.startsWith('show_')) {
          visibility[setting.key] = value
        } else if (setting.key.includes('font')) {
          if (!styles.fonts) styles.fonts = {}
          const fonts = styles.fonts as Record<string, string | Record<string, string>>
          if (setting.key.includes('size')) {
            if (!fonts.sizes) fonts.sizes = {}
            const sizes = fonts.sizes as Record<string, string>
            sizes[setting.key.replace('_size', '')] = `${value}px`
          } else {
            (fonts as Record<string, string | number | boolean>)[setting.key.replace('_font', '')] = value
          }
        } else if (setting.key.includes('spacing')) {
          if (!styles.spacing) styles.spacing = {}
          const spacing = styles.spacing as Record<string, string>
          spacing[setting.key.replace('_spacing', '')] = `${value}px`
        } else {
          (styles as Record<string, string | number | boolean>)[setting.key] = typeof value === 'number' ? `${value}px` : value
        }
      })

      await updateLayout(componentId, settings)
      setSuccess(`${component.name} updated successfully!`)

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error saving layout:', error)
      setError('Failed to save layout settings. Please try again.')
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
                <h1 className="text-2xl font-bold">Layout & Design</h1>
                <p className="text-sm text-muted-foreground">Customize colors, fonts, and layout</p>
              </div>
            </div>
            <Button asChild variant="outline">
              <Link href="/" target="_blank">
                Preview Site ↗
              </Link>
            </Button>
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
          {layoutComponents.map((component, componentIndex) => (
            <motion.div
              key={component.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: componentIndex * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {component.name}
                    <Badge variant="outline">
                      {component.settings.length} settings
                    </Badge>
                  </CardTitle>
                  <CardDescription>{component.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {component.settings.map((setting) => (
                      <div key={setting.key} className="space-y-2">
                        <Label htmlFor={`${component.id}_${setting.key}`}>
                          {setting.label}
                          {setting.unit && (
                            <span className="text-xs text-muted-foreground ml-1">
                              ({setting.unit})
                            </span>
                          )}
                        </Label>
                        
                        {setting.description && (
                          <p className="text-xs text-muted-foreground">
                            {setting.description}
                          </p>
                        )}

                        {setting.type === 'color' ? (
                          <div className="flex space-x-2">
                            <Input
                              id={`${component.id}_${setting.key}`}
                              type="color"
                              value={editingSettings[`${component.id}_${setting.key}`] !== undefined 
                                ? String(editingSettings[`${component.id}_${setting.key}`])
                                : String(setting.value) || '#000000'
                              }
                              onChange={(e) => handleInputChange(component.id, setting.key, e.target.value)}
                              className="w-16 h-10"
                            />
                            <Input
                              type="text"
                              value={editingSettings[`${component.id}_${setting.key}`] !== undefined 
                                ? String(editingSettings[`${component.id}_${setting.key}`])
                                : String(setting.value) || ''
                              }
                              onChange={(e) => handleInputChange(component.id, setting.key, e.target.value)}
                              className="flex-1 font-mono text-sm"
                              placeholder="#000000"
                            />
                          </div>
                        ) : setting.type === 'number' ? (
                          <div className="flex items-center space-x-2">
                            <Input
                              id={`${component.id}_${setting.key}`}
                              type="number"
                              min={setting.min}
                              max={setting.max}
                              step={setting.step}
                              value={editingSettings[`${component.id}_${setting.key}`] !== undefined 
                                ? Number(editingSettings[`${component.id}_${setting.key}`]) || 0
                                : Number(setting.value) || 0
                              }
                              onChange={(e) => handleInputChange(component.id, setting.key, parseInt(e.target.value))}
                              className="w-24"
                            />
                            <span className="text-sm text-muted-foreground">
                              {setting.unit}
                            </span>
                          </div>
                        ) : setting.type === 'select' ? (
                          <select
                            id={`${component.id}_${setting.key}`}
                            value={editingSettings[`${component.id}_${setting.key}`] !== undefined 
                              ? String(editingSettings[`${component.id}_${setting.key}`])
                              : String(setting.value) || ''
                            }
                            onChange={(e) => handleInputChange(component.id, setting.key, e.target.value)}
                            className="w-full p-2 border border-border rounded-md"
                          >
                            {setting.options?.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : setting.type === 'boolean' ? (
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              id={`${component.id}_${setting.key}`}
                              type="checkbox"
                              checked={editingSettings[`${component.id}_${setting.key}`] !== undefined 
                                ? editingSettings[`${component.id}_${setting.key}`] 
                                : setting.value || false
                              }
                              onChange={(e) => handleInputChange(component.id, setting.key, e.target.checked)}
                              className="rounded"
                            />
                            <span className="text-sm">Enable</span>
                          </label>
                        ) : (
                          <Input
                            id={`${component.id}_${setting.key}`}
                            type="text"
                            value={editingSettings[`${component.id}_${setting.key}`] !== undefined 
                              ? String(editingSettings[`${component.id}_${setting.key}`])
                              : String(setting.value) || ''
                            }
                            onChange={(e) => handleInputChange(component.id, setting.key, e.target.value)}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <Button
                      onClick={() => handleSaveComponent(component.id)}
                      disabled={saving}
                    >
                      {saving ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                          <span>Saving...</span>
                        </div>
                      ) : (
                        `Save ${component.name}`
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