'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAdmin, useAdminPermissions } from '@/hooks/useAdmin'
import { useCMSContent, useActivities, useGlobalSettings } from '@/hooks/useCMS'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function AdminDashboard() {
  const router = useRouter()
  const { adminUser, isAdmin, loading: adminLoading } = useAdmin()
  const permissions = useAdminPermissions()
  const { content, loading: contentLoading } = useCMSContent()
  const { activities, loading: activitiesLoading } = useActivities()
  const { settings, loading: settingsLoading } = useGlobalSettings()

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      router.push('/admin/login')
    }
  }, [isAdmin, adminLoading, router])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push('/admin/login')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  if (adminLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg">Loading admin dashboard...</span>
        </div>
      </div>
    )
  }

  const stats = {
    totalActivities: activities.length,
    totalContent: Object.keys(content).length,
    lastUpdated: settings?.lastUpdated || 'Never'
  }

  const quickActions = [
    {
      title: 'Edit Activities',
      description: 'Manage Mahuru daily activities and content',
      icon: '📝',
      href: '/admin/activities',
      permission: permissions.canEditActivities
    },
    {
      title: 'Content Management',
      description: 'Edit site text, headings, and descriptions',
      icon: '📄',
      href: '/admin/content',
      permission: permissions.canEditContent
    },
    {
      title: 'Layout & Design',
      description: 'Customize colors, fonts, and layout',
      icon: '🎨',
      href: '/admin/layout',
      permission: permissions.canEditLayout
    },
    {
      title: 'Media Library',
      description: 'Upload and manage images and files',
      icon: '🖼️',
      href: '/admin/media',
      permission: permissions.canManageMedia
    },
    {
      title: 'Global Settings',
      description: 'Site-wide configuration and settings',
      icon: '⚙️',
      href: '/admin/settings',
      permission: permissions.isSuperAdmin
    },
    {
      title: 'User Management',
      description: 'Manage admin users and permissions',
      icon: '👥',
      href: '/admin/users',
      permission: permissions.canManageUsers
    }
  ].filter(action => action.permission)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10">
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">🌿</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Mahuru Admin</h1>
                <p className="text-sm text-muted-foreground">Content Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {permissions.role?.replace('_', ' ').toUpperCase()}
              </Badge>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Welcome Section */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">
              Kia ora, {adminUser?.displayName || 'Admin'}!
            </h2>
            <p className="text-muted-foreground">
              Welcome to the Mahuru Activation 2025 content management system. 
              Manage your te reo Māori learning platform with ease.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
                <span className="text-2xl">📝</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalActivities}</div>
                <p className="text-xs text-muted-foreground">
                  Mahuru daily challenges
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Content Items</CardTitle>
                <span className="text-2xl">📄</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalContent}</div>
                <p className="text-xs text-muted-foreground">
                  Editable content pieces
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
                <span className="text-2xl">🕒</span>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-bold">
                  {stats.lastUpdated !== 'Never' 
                    ? new Date(stats.lastUpdated).toLocaleDateString()
                    : 'Never'
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  Site last modified
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={action.href}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <span className="text-3xl group-hover:scale-110 transition-transform">
                            {action.icon}
                          </span>
                          <div>
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                              {action.title}
                            </CardTitle>
                            <CardDescription>
                              {action.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest changes to your Mahuru platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {contentLoading || activitiesLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Loading recent activity...</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                      <span className="text-sm">System initialized</span>
                      <span className="text-xs text-muted-foreground">Ready for customization</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Start customizing your Mahuru platform by editing activities, content, or layout.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="flex justify-center space-x-4">
            <Button asChild variant="outline">
              <Link href="/">
                View Live Site
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/help">
                Help & Documentation
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}