'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdmin, useAdminPermissions } from '@/hooks/useAdmin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function MediaManagement() {
  const router = useRouter()
  const { isAdmin, loading: adminLoading } = useAdmin()
  const permissions = useAdminPermissions()
  
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!adminLoading && (!isAdmin || !permissions.canManageMedia)) {
      router.push('/admin/dashboard')
    }
  }, [isAdmin, adminLoading, permissions.canManageMedia, router])

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setUploading(true)
    setError('')
    setSuccess('')

    try {
      // This would integrate with Firebase Storage
      // For now, showing the interface structure
      setSuccess('File upload interface ready! Firebase Storage integration needed.')
    } catch (error) {
      console.error('Upload error:', error)
      setError('Failed to upload file. Please try again.')
    } finally {
      setUploading(false)
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
                <h1 className="text-2xl font-bold">Media Library</h1>
                <p className="text-sm text-muted-foreground">Upload and manage images and files</p>
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
          {/* Upload Area */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Upload Media</CardTitle>
                <CardDescription>
                  Add images, videos, and documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <div className="space-y-4">
                      <span className="text-4xl">📁</span>
                      <div>
                        <h3 className="text-lg font-semibold">Drop files here</h3>
                        <p className="text-sm text-muted-foreground">
                          or click to browse
                        </p>
                      </div>
                      <Input
                        type="file"
                        multiple
                        accept="image/*,video/*,.pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <p>Supported formats:</p>
                    <ul className="mt-1 space-y-1">
                      <li>• Images: JPG, PNG, GIF, SVG</li>
                      <li>• Videos: MP4, WebM</li>
                      <li>• Documents: PDF, DOC, DOCX</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Media Gallery */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Media Library
                  <Badge variant="outline">0 items</Badge>
                </CardTitle>
                <CardDescription>
                  Manage your uploaded media files
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center space-y-4">
                    <span className="text-6xl">🖼️</span>
                    <div>
                      <h3 className="text-xl font-semibold">No Media Yet</h3>
                      <p className="text-muted-foreground">
                        Upload your first image or file to get started
                      </p>
                    </div>
                    <Alert className="border-blue-200 bg-blue-50">
                      <AlertDescription className="text-blue-600">
                        <strong>Note:</strong> Firebase Storage integration is required for full media upload functionality. 
                        The interface is ready and can be connected to your Firebase Storage bucket.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Media Categories */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Media Categories</CardTitle>
              <CardDescription>
                Organize your media into categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Images', icon: '🖼️', count: 0 },
                  { name: 'Videos', icon: '🎥', count: 0 },
                  { name: 'Documents', icon: '📄', count: 0 },
                  { name: 'Audio', icon: '🎵', count: 0 }
                ].map(category => (
                  <div
                    key={category.name}
                    className="border border-border rounded-lg p-4 text-center hover:bg-secondary/50 transition-colors cursor-pointer"
                  >
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <div className="font-medium">{category.name}</div>
                    <div className="text-sm text-muted-foreground">{category.count} files</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}