import { doc, setDoc, collection, getDocs } from 'firebase/firestore'
import { db } from './firebase'
import { mahuruActivities2025 } from '../data/mahuru-activities'
import { 
  AdminUser, 
  ActivityContent, 
  GlobalSettings, 
  CMSContent,
  LayoutSettings 
} from '../types/cms'

// Initialize admin system with default data
export const initializeAdminSystem = async (): Promise<void> => {
  try {
    console.log('🔧 Initializing Mahuru Admin System...')

    // Check if already initialized
    const activitiesSnap = await getDocs(collection(db, 'activities'))
    if (!activitiesSnap.empty) {
      console.log('✅ Admin system already initialized')
      return
    }

    // Seed activities from mahuru-activities.ts
    console.log('📝 Seeding Mahuru activities...')
    const activityPromises = mahuruActivities2025.map(async (activity) => {
      const activityData: ActivityContent = {
        id: `day-${activity.day}`,
        day: activity.day,
        beginner: activity.beginner,
        intermediate: activity.intermediate,
        advanced: activity.advanced,
        title: {
          beginner: generateActivityTitle(activity.beginner),
          intermediate: generateActivityTitle(activity.intermediate),
          advanced: generateActivityTitle(activity.advanced)
        },
        points: {
          beginner: 10,
          intermediate: 15,
          advanced: 20
        },
        tips: [
          'Take your time and practice at your own pace',
          'Use the Mahuru website resources for additional support',
          'Share your progress with whānau and friends',
          'Remember: kia kaha (be strong) in your learning journey!'
        ],
        resources: [],
        lastUpdated: new Date().toISOString(),
        updatedBy: 'system'
      }

      await setDoc(doc(db, 'activities', `day-${activity.day}`), activityData)
    })

    await Promise.all(activityPromises)
    console.log('✅ Activities seeded successfully')

    // Seed default CMS content
    console.log('📄 Seeding CMS content...')
    const cmsContent: CMSContent[] = [
      {
        id: 'site_title',
        type: 'text',
        key: 'site_title',
        value: 'Mahuru Activation 2025',
        metadata: {
          description: 'Main site title',
          section: 'homepage',
          component: 'header'
        }
      },
      {
        id: 'site_subtitle',
        type: 'text',
        key: 'site_subtitle',
        value: '30-Day Te Reo Māori Challenge',
        metadata: {
          description: 'Site subtitle',
          section: 'homepage',
          component: 'header'
        }
      },
      {
        id: 'hero_heading',
        type: 'text',
        key: 'hero_heading',
        value: 'Kia Ora!\nMaster Te Reo Māori',
        metadata: {
          description: 'Hero section main heading',
          section: 'homepage',
          component: 'hero'
        }
      },
      {
        id: 'hero_description',
        type: 'text',
        key: 'hero_description',
        value: 'Join the Mahuru Challenge! Participate in 30 days of progressive te reo Māori activation activities. From beginner pronunciation to advanced conversation, strengthen your reo Māori journey with daily challenges and expert guidance.',
        metadata: {
          description: 'Hero section description',
          section: 'homepage',
          component: 'hero'
        }
      }
    ]

    const contentPromises = cmsContent.map(async (content) => {
      await setDoc(doc(db, 'cms_content', content.key), content)
    })

    await Promise.all(contentPromises)
    console.log('✅ CMS content seeded successfully')

    // Seed global settings
    console.log('⚙️ Seeding global settings...')
    const globalSettings: GlobalSettings = {
      id: 'main',
      siteName: 'Mahuru Activation 2025',
      siteDescription: 'Te Reo Māori Learning Platform - 30 Days of Progressive Language Activation',
      siteUrl: 'https://maori-advent-calendar.netlify.app',
      socialMedia: {
        facebook: '',
        twitter: '',
        instagram: ''
      },
      seo: {
        title: 'Mahuru Māori 2025 - Te Reo Māori Learning Platform',
        description: 'Join the Mahuru Māori Challenge! Participate in 30 days of te reo Māori activation activities.',
        keywords: ['Mahuru', 'te reo Māori', 'Māori language', 'learning', 'Aotearoa'],
        ogImage: ''
      },
      features: {
        enableEmailSignup: true,
        enableSocialLogin: false,
        enableProgressTracking: true,
        enableAchievements: true
      },
      branding: {
        logo: '',
        favicon: '',
        primaryColor: '#10b981',
        secondaryColor: '#f3f4f6'
      },
      lastUpdated: new Date().toISOString(),
      updatedBy: 'system'
    }

    await setDoc(doc(db, 'global_settings', 'main'), globalSettings)
    console.log('✅ Global settings seeded successfully')

    // Seed default layout settings
    console.log('🎨 Seeding layout settings...')
    const layoutSettings: LayoutSettings[] = [
      {
        id: 'global',
        component: 'global',
        styles: {
          colors: {
            primary: '#10b981',
            secondary: '#f3f4f6',
            accent: '#f59e0b',
            background: '#ffffff'
          },
          fonts: {
            primary: 'Inter',
            secondary: 'Inter',
            sizes: {
              heading: '32px',
              body: '16px'
            }
          },
          spacing: {
            section: '48px',
            card: '24px'
          },
          borderRadius: '8px'
        },
        visibility: {},
        content: {},
        lastUpdated: new Date().toISOString(),
        updatedBy: 'system'
      },
      {
        id: 'homepage',
        component: 'homepage',
        styles: {
          heroCentered: false,
          completionAnimation: true
        },
        visibility: {
          showFeatures: true,
          showAbout: true
        },
        content: {},
        lastUpdated: new Date().toISOString(),
        updatedBy: 'system'
      },
      {
        id: 'activity',
        component: 'activity',
        styles: {
          tipsExpanded: false,
          completionAnimation: true
        },
        visibility: {
          showTips: true
        },
        content: {},
        lastUpdated: new Date().toISOString(),
        updatedBy: 'system'
      }
    ]

    const layoutPromises = layoutSettings.map(async (layout) => {
      await setDoc(doc(db, 'layout_settings', layout.component), layout)
    })

    await Promise.all(layoutPromises)
    console.log('✅ Layout settings seeded successfully')

    console.log('🎉 Mahuru Admin System initialized successfully!')
    
  } catch (error) {
    console.error('❌ Error initializing admin system:', error)
    throw error
  }
}

// Create first admin user
export const createFirstAdmin = async (email: string, uid: string): Promise<void> => {
  try {
    const adminUser: AdminUser = {
      uid,
      email,
      displayName: 'Super Admin',
      role: 'super_admin',
      permissions: {
        canEditContent: true,
        canEditLayout: true,
        canManageUsers: true,
        canManageMedia: true,
        canEditActivities: true,
        canViewAnalytics: true
      },
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }

    await setDoc(doc(db, 'admin_users', uid), adminUser)
    console.log('✅ First admin user created successfully')
  } catch (error) {
    console.error('❌ Error creating first admin user:', error)
    throw error
  }
}

// Helper function to generate activity titles
const generateActivityTitle = (activityText: string): string => {
  if (activityText.includes('pronunciation')) return 'Pronunciation Practice'
  if (activityText.includes('greet')) return 'Te Reo Greetings'
  if (activityText.includes('goodbye')) return 'Farewell Practice'
  if (activityText.includes('introduce')) return 'Self Introduction'
  if (activityText.includes('home') || activityText.includes('objects')) return 'Home Vocabulary'
  if (activityText.includes('doing') || activityText.includes('responses')) return 'Wellbeing Check'
  if (activityText.includes('work') || activityText.includes('label')) return 'Workplace Te Reo'
  if (activityText.includes('email') || activityText.includes('message')) return 'Digital Te Reo'
  if (activityText.includes('friend') || activityText.includes('family')) return 'Introductions'
  if (activityText.includes('shopping') || activityText.includes('supermarket')) return 'Shopping Te Reo'
  if (activityText.includes('weather')) return 'Weather Description'
  if (activityText.includes('pepeha')) return 'Pepeha Creation'
  if (activityText.includes('karakia')) return 'Karakia Practice'
  if (activityText.includes('hello')) return 'Greeting Varieties'
  if (activityText.includes('waiata')) return 'Waiata Learning'
  if (activityText.includes('walk') || activityText.includes('surroundings')) return 'Environment Description'
  if (activityText.includes('count')) return 'Counting Practice'
  if (activityText.includes('days') || activityText.includes('week')) return 'Days of Week'
  if (activityText.includes('marae')) return 'Marae Knowledge'
  if (activityText.includes('tour')) return 'Te Reo Tours'
  if (activityText.includes('history')) return 'Te Reo History'
  if (activityText.includes('coffee') || activityText.includes('tea')) return 'Kai Orders'
  if (activityText.includes('Facebook') || activityText.includes('continue')) return 'Future Learning'
  
  // Fallback to first few words
  const words = activityText.split(' ')
  return words.slice(0, 3).join(' ') + (words.length > 3 ? '...' : '')
}

// Expose initialization function globally for easy access
if (typeof window !== 'undefined') {
  // Create a typed interface for the global functions
  interface WindowWithGlobals extends Window {
    initializeMahuruAdmin?: typeof initializeAdminSystem;
    createFirstAdmin?: typeof createFirstAdmin;
  }
  
  const globalWindow = window as WindowWithGlobals;
  globalWindow.initializeMahuruAdmin = initializeAdminSystem;
  globalWindow.createFirstAdmin = createFirstAdmin;
}