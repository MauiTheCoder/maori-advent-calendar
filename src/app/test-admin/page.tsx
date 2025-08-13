'use client'

export default function TestAdmin() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #f0fdf4 100%)',
      fontFamily: 'system-ui, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '40px',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          background: '#dcfce7',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          fontSize: '28px'
        }}>
          🌿
        </div>
        
        <h1 style={{
          color: '#1f2937',
          marginBottom: '8px',
          fontSize: '24px',
          fontWeight: '700'
        }}>
          Mahuru Admin Test
        </h1>
        
        <p style={{
          color: '#6b7280',
          marginBottom: '32px',
          fontSize: '14px'
        }}>
          React routes are working!
        </p>
        
        <div style={{ marginBottom: '12px' }}>
          <a 
            href="/admin.html"
            style={{
              display: 'block',
              width: '100%',
              padding: '12px 16px',
              background: '#10b981',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              marginBottom: '12px'
            }}
          >
            Go to Static Admin
          </a>
        </div>
        
        <div style={{ marginBottom: '12px' }}>
          <a 
            href="/"
            style={{
              display: 'block',
              width: '100%',
              padding: '12px 16px',
              background: 'white',
              color: '#374151',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              border: '1px solid #d1d5db'
            }}
          >
            ← Back to Main Site
          </a>
        </div>
        
        <div style={{
          marginTop: '32px',
          color: '#9ca3af',
          fontSize: '12px'
        }}>
          Mahuru Activation 2025 • Te Wānanga o Aotearoa
        </div>
      </div>
    </div>
  )
}