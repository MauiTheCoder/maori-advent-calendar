'use client'

import Link from 'next/link'

export default function AdminIndex() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
          <span className="text-2xl">🌿</span>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold">Mahuru Admin</h1>
          <p className="text-muted-foreground mt-2">
            Content Management System
          </p>
        </div>

        <div className="space-y-3">
          <Link 
            href="/admin/setup"
            className="block w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Initialize System
          </Link>
          
          <Link 
            href="/admin/login"
            className="block w-full px-4 py-2 border border-border rounded-md hover:bg-secondary/50 transition-colors"
          >
            Admin Login
          </Link>
          
          <Link 
            href="/"
            className="block w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Main Site
          </Link>
        </div>
      </div>
    </div>
  )
}