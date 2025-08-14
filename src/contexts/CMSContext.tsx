'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { 
  useCMSContent, 
  useActivities, 
  useLayoutSettings, 
  useMediaAssets, 
  useGlobalSettings 
} from '@/hooks/useCMS'
import { CMSContent, ActivityContent, LayoutSettings, MediaAsset, GlobalSettings } from '@/types/cms'

interface CMSContextType {
  // Content management
  content: Record<string, CMSContent>
  contentLoading: boolean
  updateContent: (key: string, value: string | number | boolean | Record<string, unknown>, metadata?: Record<string, string>) => Promise<void>
  getContent: (key: string, defaultValue?: string | number | boolean | Record<string, unknown>) => string | number | boolean | Record<string, unknown> | undefined

  // Activities management
  activities: ActivityContent[]
  activitiesLoading: boolean
  updateActivity: (day: number, updates: Partial<ActivityContent>) => Promise<void>
  getActivity: (day: number) => ActivityContent | undefined

  // Layout settings
  layouts: Record<string, LayoutSettings>
  layoutsLoading: boolean
  updateLayout: (component: string, settings: Partial<LayoutSettings>) => Promise<void>
  getLayout: (component: string) => LayoutSettings | undefined

  // Media assets
  assets: MediaAsset[]
  assetsLoading: boolean
  uploadAsset: (file: File, category?: string) => Promise<MediaAsset>
  deleteAsset: (assetId: string) => Promise<void>

  // Global settings
  globalSettings: GlobalSettings | null
  globalSettingsLoading: boolean
  updateGlobalSettings: (updates: Partial<GlobalSettings>) => Promise<void>
}

const CMSContext = createContext<CMSContextType | null>(null)

interface CMSProviderProps {
  children: ReactNode
}

export function CMSProvider({ children }: CMSProviderProps) {
  const { content, loading: contentLoading, updateContent, getContent } = useCMSContent()
  const { activities, loading: activitiesLoading, updateActivity, getActivity } = useActivities()
  const { layouts, loading: layoutsLoading, updateLayout, getLayout } = useLayoutSettings()
  const { assets, loading: assetsLoading, uploadAsset, deleteAsset } = useMediaAssets()
  const { settings: globalSettings, loading: globalSettingsLoading, updateGlobalSettings } = useGlobalSettings()

  const contextValue: CMSContextType = {
    // Content
    content,
    contentLoading,
    updateContent,
    getContent,
    
    // Activities
    activities,
    activitiesLoading,
    updateActivity,
    getActivity,
    
    // Layouts
    layouts,
    layoutsLoading,
    updateLayout,
    getLayout,
    
    // Media
    assets,
    assetsLoading,
    uploadAsset,
    deleteAsset,
    
    // Global settings
    globalSettings,
    globalSettingsLoading,
    updateGlobalSettings
  }

  return (
    <CMSContext.Provider value={contextValue}>
      {children}
    </CMSContext.Provider>
  )
}

export function useCMSContext(): CMSContextType {
  const context = useContext(CMSContext)
  if (!context) {
    throw new Error('useCMSContext must be used within a CMSProvider')
  }
  return context
}