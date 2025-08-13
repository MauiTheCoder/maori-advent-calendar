export interface CMSContent {
  id: string
  type: 'text' | 'image' | 'layout' | 'activity' | 'global'
  key: string
  value: any
  metadata?: {
    description?: string
    section?: string
    component?: string
    lastUpdated?: string
    updatedBy?: string
  }
}

export interface ActivityContent {
  id: string
  day: number
  beginner: string
  intermediate: string
  advanced: string
  title?: {
    beginner?: string
    intermediate?: string
    advanced?: string
  }
  points?: {
    beginner?: number
    intermediate?: number
    advanced?: number
  }
  tips?: string[]
  resources?: {
    title: string
    url: string
    type: 'video' | 'article' | 'audio' | 'pdf'
  }[]
  lastUpdated?: string
  updatedBy?: string
}

export interface LayoutSettings {
  id: string
  component: string
  styles: {
    colors?: {
      primary?: string
      secondary?: string
      accent?: string
      background?: string
    }
    fonts?: {
      primary?: string
      secondary?: string
      sizes?: Record<string, string>
    }
    spacing?: Record<string, string>
    borderRadius?: string
    heroCentered?: boolean
    tipsExpanded?: boolean
    completionAnimation?: boolean
    [key: string]: any
  }
  visibility?: {
    [key: string]: boolean
  }
  content?: Record<string, any>
  lastUpdated?: string
  updatedBy?: string
}

export interface MediaAsset {
  id: string
  name: string
  url: string
  type: 'image' | 'video' | 'audio' | 'document'
  size: number
  mimeType: string
  alt?: string
  category?: string
  uploadedAt: string
  uploadedBy: string
}

export interface GlobalSettings {
  id: string
  siteName: string
  siteDescription: string
  siteUrl: string
  socialMedia?: {
    facebook?: string
    twitter?: string
    instagram?: string
  }
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
    ogImage?: string
  }
  features?: {
    enableEmailSignup?: boolean
    enableSocialLogin?: boolean
    enableProgressTracking?: boolean
    enableAchievements?: boolean
  }
  branding?: {
    logo?: string
    favicon?: string
    primaryColor?: string
    secondaryColor?: string
  }
  lastUpdated?: string
  updatedBy?: string
}

export interface AdminUser {
  uid: string
  email: string
  displayName?: string
  role: 'super_admin' | 'admin' | 'editor'
  permissions: {
    canEditContent?: boolean
    canEditLayout?: boolean
    canManageUsers?: boolean
    canManageMedia?: boolean
    canEditActivities?: boolean
    canViewAnalytics?: boolean
  }
  lastLogin?: string
  createdAt: string
}

export interface ContentSection {
  id: string
  name: string
  description: string
  fields: ContentField[]
}

export interface ContentField {
  id: string
  label: string
  type: 'text' | 'textarea' | 'rich-text' | 'image' | 'select' | 'boolean' | 'color' | 'number'
  required?: boolean
  defaultValue?: any
  options?: { label: string; value: any }[]
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: string
  }
  placeholder?: string
  helpText?: string
}