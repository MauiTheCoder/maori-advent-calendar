'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function AdminHelp() {
  const helpSections = [
    {
      title: 'Getting Started',
      description: 'Learn the basics of managing your Mahuru platform',
      items: [
        'Navigate to /admin/setup to initialize your admin system',
        'Create your first admin user account',
        'Explore the dashboard to familiarize yourself with the interface',
        'Start with editing activities or content to see changes'
      ]
    },
    {
      title: 'Managing Activities',
      description: 'Edit the 30 days of Mahuru te reo Māori activities',
      items: [
        'Go to Activities Management from the dashboard',
        'Click on any day (1-30) to edit its content',
        'Edit beginner, intermediate, and advanced level activities',
        'Save changes to update the live site immediately'
      ]
    },
    {
      title: 'Content Management',
      description: 'Customize text, headings, and descriptions',
      items: [
        'Access Content Management to edit site text',
        'Sections include Homepage, Features, About, and Activity pages',
        'Changes are automatically saved to the database',
        'View changes live on the main site'
      ]
    },
    {
      title: 'Layout & Design',
      description: 'Customize colors, fonts, and visual styling',
      items: [
        'Use Layout & Design to change the visual appearance',
        'Customize color scheme: primary, secondary, accent colors',
        'Adjust typography: fonts and text sizes',
        'Modify spacing and layout options'
      ]
    },
    {
      title: 'Media Library',
      description: 'Upload and manage images and files',
      items: [
        'Upload images, videos, and documents',
        'Organize media into categories',
        'Note: Firebase Storage setup required for full functionality',
        'Use uploaded media in content and activities'
      ]
    }
  ]

  const technicalInfo = [
    {
      title: 'Technology Stack',
      items: [
        'Next.js 15 with React 18',
        'Firebase Firestore database',
        'Firebase Authentication',
        'TypeScript for type safety',
        'Tailwind CSS for styling'
      ]
    },
    {
      title: 'Database Collections',
      items: [
        'activities: 30 days of Mahuru content',
        'cms_content: Editable site text',
        'layout_settings: Visual customization',
        'admin_users: Admin user management',
        'global_settings: Site-wide configuration'
      ]
    },
    {
      title: 'Admin Permissions',
      items: [
        'Super Admin: Full access to all features',
        'Admin: Content and layout editing',
        'Editor: Content editing only',
        'Custom permissions per admin user'
      ]
    }
  ]

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
                <h1 className="text-2xl font-bold">Help & Documentation</h1>
                <p className="text-sm text-muted-foreground">Learn how to use the Mahuru admin system</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Quick Start Guide */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🚀</span>
                  <span>Quick Start Guide</span>
                </CardTitle>
                <CardDescription>
                  Get up and running with your Mahuru admin system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {helpSections.map((section, index) => (
                    <motion.div
                      key={section.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-3"
                    >
                      <h3 className="text-lg font-semibold">{section.title}</h3>
                      <p className="text-sm text-muted-foreground">{section.description}</p>
                      <ul className="space-y-2">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-sm flex items-start space-x-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Technical Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🔧</span>
                  <span>Technical Information</span>
                </CardTitle>
                <CardDescription>
                  Technical details about the Mahuru platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {technicalInfo.map((section, index) => (
                    <div key={section.title} className="space-y-3">
                      <h3 className="text-lg font-semibold">{section.title}</h3>
                      <ul className="space-y-2">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-sm flex items-start space-x-2">
                            <span className="text-accent mt-1">•</span>
                            <span className="font-mono text-xs bg-secondary/50 px-2 py-1 rounded">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Support Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>💬</span>
                  <span>Support & Contact</span>
                </CardTitle>
                <CardDescription>
                  Get help when you need it
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Te Wānanga o Aotearoa Support</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      For assistance with your Mahuru platform, contact your IT support team or the digital learning team.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div>📧 <strong>Email:</strong> digitallearning@twoa.ac.nz</div>
                      <div>🌐 <strong>Platform:</strong> Mahuru Activation 2025</div>
                      <div>🔧 <strong>Version:</strong> 1.0.0</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button asChild variant="outline" className="h-auto p-4">
                      <Link href="/admin/dashboard">
                        <div className="text-center">
                          <div className="text-2xl mb-2">🏠</div>
                          <div className="font-semibold">Return to Dashboard</div>
                          <div className="text-xs text-muted-foreground">Go back to admin home</div>
                        </div>
                      </Link>
                    </Button>

                    <Button asChild variant="outline" className="h-auto p-4">
                      <a href="/" target="_blank">
                        <div className="text-center">
                          <div className="text-2xl mb-2">👁️</div>
                          <div className="font-semibold">View Live Site</div>
                          <div className="text-xs text-muted-foreground">See your changes live</div>
                        </div>
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}