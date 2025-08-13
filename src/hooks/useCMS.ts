'use client'

import { useState, useEffect } from 'react'
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot
} from 'firebase/firestore'
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll
} from 'firebase/storage'
import { db } from '@/lib/firebase'
import { 
  CMSContent, 
  ActivityContent, 
  LayoutSettings, 
  MediaAsset, 
  GlobalSettings 
} from '@/types/cms'

export const useCMSContent = () => {
  const [content, setContent] = useState<Record<string, CMSContent>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'cms_content'),
      (snapshot) => {
        const contentMap: Record<string, CMSContent> = {}
        snapshot.docs.forEach(doc => {
          const data = doc.data() as CMSContent
          contentMap[data.key] = { ...data, id: doc.id }
        })
        setContent(contentMap)
        setLoading(false)
      },
      (error) => {
        console.error('Error fetching CMS content:', error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const updateContent = async (key: string, value: any, metadata?: any): Promise<void> => {
    try {
      const contentData: Partial<CMSContent> = {
        key,
        value,
        metadata: {
          ...metadata,
          lastUpdated: new Date().toISOString()
        }
      }

      const docRef = doc(db, 'cms_content', key)
      await setDoc(docRef, contentData, { merge: true })
    } catch (error) {
      console.error('Error updating content:', error)
      throw error
    }
  }

  const getContent = (key: string, defaultValue?: any): any => {
    return content[key]?.value ?? defaultValue
  }

  return {
    content,
    loading,
    updateContent,
    getContent
  }
}

export const useActivities = () => {
  const [activities, setActivities] = useState<ActivityContent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'activities'), orderBy('day')),
      (snapshot) => {
        const activitiesData = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as ActivityContent[]
        setActivities(activitiesData)
        setLoading(false)
      },
      (error) => {
        console.error('Error fetching activities:', error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const updateActivity = async (day: number, updates: Partial<ActivityContent>): Promise<void> => {
    try {
      const activityData = {
        ...updates,
        day,
        lastUpdated: new Date().toISOString()
      }

      await setDoc(doc(db, 'activities', `day-${day}`), activityData, { merge: true })
    } catch (error) {
      console.error('Error updating activity:', error)
      throw error
    }
  }

  const getActivity = (day: number): ActivityContent | undefined => {
    return activities.find(activity => activity.day === day)
  }

  return {
    activities,
    loading,
    updateActivity,
    getActivity
  }
}

export const useLayoutSettings = () => {
  const [layouts, setLayouts] = useState<Record<string, LayoutSettings>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'layout_settings'),
      (snapshot) => {
        const layoutsMap: Record<string, LayoutSettings> = {}
        snapshot.docs.forEach(doc => {
          const data = doc.data() as LayoutSettings
          layoutsMap[data.component] = { ...data, id: doc.id }
        })
        setLayouts(layoutsMap)
        setLoading(false)
      },
      (error) => {
        console.error('Error fetching layout settings:', error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const updateLayout = async (component: string, settings: Partial<LayoutSettings>): Promise<void> => {
    try {
      const layoutData = {
        ...settings,
        component,
        lastUpdated: new Date().toISOString()
      }

      await setDoc(doc(db, 'layout_settings', component), layoutData, { merge: true })
    } catch (error) {
      console.error('Error updating layout:', error)
      throw error
    }
  }

  const getLayout = (component: string): LayoutSettings | undefined => {
    return layouts[component]
  }

  return {
    layouts,
    loading,
    updateLayout,
    getLayout
  }
}

export const useMediaAssets = () => {
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'media_assets'), orderBy('uploadedAt', 'desc')),
      (snapshot) => {
        const assetsData = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as MediaAsset[]
        setAssets(assetsData)
        setLoading(false)
      },
      (error) => {
        console.error('Error fetching media assets:', error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const uploadAsset = async (file: File, category?: string): Promise<MediaAsset> => {
    try {
      // This would need Firebase Storage setup
      // For now, returning a mock implementation
      throw new Error('Firebase Storage not implemented yet')
    } catch (error) {
      console.error('Error uploading asset:', error)
      throw error
    }
  }

  const deleteAsset = async (assetId: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'media_assets', assetId))
    } catch (error) {
      console.error('Error deleting asset:', error)
      throw error
    }
  }

  return {
    assets,
    loading,
    uploadAsset,
    deleteAsset
  }
}

export const useGlobalSettings = () => {
  const [settings, setSettings] = useState<GlobalSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'global_settings', 'main'),
      (snapshot) => {
        if (snapshot.exists()) {
          setSettings({ ...snapshot.data(), id: snapshot.id } as GlobalSettings)
        }
        setLoading(false)
      },
      (error) => {
        console.error('Error fetching global settings:', error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const updateGlobalSettings = async (updates: Partial<GlobalSettings>): Promise<void> => {
    try {
      const settingsData = {
        ...updates,
        lastUpdated: new Date().toISOString()
      }

      await setDoc(doc(db, 'global_settings', 'main'), settingsData, { merge: true })
    } catch (error) {
      console.error('Error updating global settings:', error)
      throw error
    }
  }

  return {
    settings,
    loading,
    updateGlobalSettings
  }
}