'use client'

// Environment Debug Component - REMOVE IN PRODUCTION
export default function EnvDebug() {
  // Only show in development or if explicitly enabled
  if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_DEBUG_ENV) {
    return null
  }

  const envVars = {
    'NEXT_PUBLIC_FIREBASE_API_KEY': process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 
      `${process.env.NEXT_PUBLIC_FIREBASE_API_KEY.substring(0, 10)}...` : 'MISSING',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN': process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'MISSING',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID': process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'MISSING',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET': process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'MISSING',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID': process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'MISSING',
    'NEXT_PUBLIC_FIREBASE_APP_ID': process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? 
      `${process.env.NEXT_PUBLIC_FIREBASE_APP_ID.substring(0, 15)}...` : 'MISSING',
    'NEXT_PUBLIC_ADMIN_EMAILS': process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'MISSING',
    'NEXT_PUBLIC_SITE_URL': process.env.NEXT_PUBLIC_SITE_URL || 'MISSING',
    'NEXT_PUBLIC_ENVIRONMENT': process.env.NEXT_PUBLIC_ENVIRONMENT || 'MISSING',
    'NODE_ENV': process.env.NODE_ENV || 'MISSING'
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      padding: '10px',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: 9999,
      maxHeight: '200px',
      overflow: 'auto'
    }}>
      <h3 style={{ color: '#ff6b6b', margin: '0 0 10px 0' }}>🔍 Environment Debug Panel</h3>
      {Object.entries(envVars).map(([key, value]) => (
        <div key={key} style={{ marginBottom: '5px' }}>
          <span style={{ color: value === 'MISSING' ? '#ff6b6b' : '#4ecdc4' }}>
            {value === 'MISSING' ? '❌' : '✅'}
          </span>
          <strong style={{ color: '#ffd93d' }}> {key}:</strong>{' '}
          <span style={{ color: value === 'MISSING' ? '#ff6b6b' : '#ffffff' }}>
            {value}
          </span>
        </div>
      ))}
      <p style={{ color: '#888', fontSize: '10px', margin: '10px 0 0 0' }}>
        This debug panel only shows in development or when NEXT_PUBLIC_DEBUG_ENV is set.
      </p>
    </div>
  )
}