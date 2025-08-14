// Quick environment variables check
const fs = require('fs')
const path = require('path')

console.log('🔍 Checking Environment Variables for Mahuru Activation 2025')
console.log('='.repeat(60))

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local')
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!')
  console.log('Please create .env.local file with your Firebase configuration.')
  process.exit(1)
}

// Read and parse .env.local
const envContent = fs.readFileSync(envPath, 'utf8')
const env = {}

envContent.split('\n').forEach(line => {
  const trimmed = line.trim()
  if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
    const [key, ...valueParts] = trimmed.split('=')
    if (key && valueParts.length > 0) {
      env[key] = valueParts.join('=')
    }
  }
})

// Required variables
const required = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'NEXT_PUBLIC_ADMIN_EMAILS',
  'NEXT_PUBLIC_SITE_URL'
]

console.log('✅ Environment Variables Status:')
console.log('')

let allGood = true

required.forEach(key => {
  const value = env[key]
  if (value) {
    if (key === 'NEXT_PUBLIC_ADMIN_EMAILS' && value === 'your-email@example.com') {
      console.log(`⚠️  ${key}: ${value} (NEEDS TO BE UPDATED)`)
      allGood = false
    } else {
      console.log(`✅ ${key}: ${value.length > 50 ? value.substring(0, 47) + '...' : value}`)
    }
  } else {
    console.log(`❌ ${key}: MISSING`)
    allGood = false
  }
})

console.log('')

if (allGood) {
  console.log('🎉 All environment variables are configured!')
  console.log('')
  console.log('Next steps:')
  console.log('1. Run: npm run dev (or bun dev)')
  console.log('2. Visit: http://localhost:3000')
  console.log('3. Go to: http://localhost:3000/admin/setup')
  console.log('4. Initialize database and create admin account')
} else {
  console.log('⚠️  Please update the missing or placeholder environment variables.')
  console.log('')
  console.log('What you need to do:')
  if (env['NEXT_PUBLIC_ADMIN_EMAILS'] === 'your-email@example.com') {
    console.log('- Update NEXT_PUBLIC_ADMIN_EMAILS with your actual email address')
  }
  console.log('')
  console.log('For production deployment, you also need to set these same')
  console.log('environment variables in your Netlify dashboard.')
}

console.log('')
console.log('📚 For detailed setup instructions, see:')
console.log('- QUICK_START.md')
console.log('- FIREBASE_PROJECT_SETUP.md')