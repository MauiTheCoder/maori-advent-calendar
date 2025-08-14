#!/usr/bin/env node

/**
 * Firebase Setup and Validation Script
 * Helps configure and validate Firebase environment variables
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

function validateFirebaseConfig(config) {
  const required = [
    'apiKey',
    'authDomain', 
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ]
  
  const missing = required.filter(key => !config[key])
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`)
  }
  
  // Validate format
  if (!config.authDomain.includes('.firebaseapp.com')) {
    throw new Error('authDomain should end with .firebaseapp.com')
  }
  
  if (!config.storageBucket.includes('.appspot.com')) {
    throw new Error('storageBucket should end with .appspot.com')
  }
  
  return true
}

function generateEnvFile(config, adminEmails, siteUrl, environment) {
  const envContent = `# Firebase Configuration (${environment})
NEXT_PUBLIC_FIREBASE_API_KEY=${config.apiKey}
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${config.authDomain}
NEXT_PUBLIC_FIREBASE_PROJECT_ID=${config.projectId}
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${config.storageBucket}
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${config.messagingSenderId}
NEXT_PUBLIC_FIREBASE_APP_ID=${config.appId}
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=${config.measurementId || ''}

# Admin Configuration  
NEXT_PUBLIC_ADMIN_EMAILS=${adminEmails}

# Site Configuration
NEXT_PUBLIC_SITE_URL=${siteUrl}
NEXT_PUBLIC_ENVIRONMENT=${environment}

# Optional: Email service (for notifications)
# RESEND_API_KEY=your_resend_api_key_here
`

  return envContent
}

function generateNetlifyDeployment(config, adminEmails, siteUrl) {
  const deployScript = `#!/bin/bash

# Netlify Deployment Script for Mahuru Activation 2025
# Run this script to set environment variables in Netlify

echo "🚀 Setting up Netlify environment variables..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI is not installed. Install it with: npm install -g netlify-cli"
    exit 1
fi

# Set environment variables
netlify env:set NEXT_PUBLIC_FIREBASE_API_KEY "${config.apiKey}"
netlify env:set NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN "${config.authDomain}"
netlify env:set NEXT_PUBLIC_FIREBASE_PROJECT_ID "${config.projectId}"
netlify env:set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET "${config.storageBucket}"
netlify env:set NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID "${config.messagingSenderId}"
netlify env:set NEXT_PUBLIC_FIREBASE_APP_ID "${config.appId}"
netlify env:set NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID "${config.measurementId || ''}"
netlify env:set NEXT_PUBLIC_ADMIN_EMAILS "${adminEmails}"
netlify env:set NEXT_PUBLIC_SITE_URL "${siteUrl}"
netlify env:set NEXT_PUBLIC_ENVIRONMENT "production"

echo "✅ Environment variables set successfully!"
echo "🔄 Triggering deployment..."

netlify deploy --prod

echo "🎉 Deployment complete!"
`

  return deployScript
}

async function main() {
  console.log('🌿 Mahuru Activation 2025 - Firebase Setup')
  console.log('==========================================')
  console.log('')

  try {
    // Check if .env.local already exists
    const envPath = path.join(process.cwd(), '.env.local')
    if (fs.existsSync(envPath)) {
      const overwrite = await question('⚠️  .env.local already exists. Overwrite? (y/n): ')
      if (overwrite.toLowerCase() !== 'y') {
        console.log('Setup cancelled.')
        process.exit(0)
      }
    }

    console.log('Please provide your Firebase configuration:')
    console.log('(You can find this in Firebase Console > Project Settings > Your apps)')
    console.log('')

    const config = {}
    config.apiKey = await question('Firebase API Key: ')
    config.authDomain = await question('Auth Domain (project-id.firebaseapp.com): ')
    config.projectId = await question('Project ID: ')
    config.storageBucket = await question('Storage Bucket (project-id.appspot.com): ')
    config.messagingSenderId = await question('Messaging Sender ID: ')
    config.appId = await question('App ID: ')
    config.measurementId = await question('Measurement ID (optional, for Analytics): ')

    console.log('')
    console.log('Additional configuration:')
    const adminEmails = await question('Admin emails (comma-separated): ')
    const siteUrl = await question('Site URL (default: https://maori-advent-calendar.netlify.app): ') 
      || 'https://maori-advent-calendar.netlify.app'
    const environment = await question('Environment (development/production, default: development): ') 
      || 'development'

    // Validate configuration
    console.log('')
    console.log('🔍 Validating configuration...')
    validateFirebaseConfig(config)
    console.log('✅ Configuration looks good!')

    // Generate files
    console.log('')
    console.log('📝 Generating configuration files...')
    
    // Create .env.local
    const envContent = generateEnvFile(config, adminEmails, siteUrl, environment)
    fs.writeFileSync(envPath, envContent)
    console.log('✅ Created .env.local')

    // Create Netlify deployment script
    const scriptsDir = path.join(process.cwd(), 'scripts')
    if (!fs.existsSync(scriptsDir)) {
      fs.mkdirSync(scriptsDir, { recursive: true })
    }

    const deployScript = generateNetlifyDeployment(config, adminEmails, siteUrl)
    const deployPath = path.join(scriptsDir, 'deploy-netlify.sh')
    fs.writeFileSync(deployPath, deployScript)
    fs.chmodSync(deployPath, '755') // Make executable
    console.log('✅ Created scripts/deploy-netlify.sh')

    // Create configuration summary
    const summaryPath = path.join(process.cwd(), 'firebase-config-summary.json')
    const summary = {
      projectId: config.projectId,
      authDomain: config.authDomain,
      adminEmails: adminEmails.split(',').map(e => e.trim()),
      siteUrl,
      environment,
      setupDate: new Date().toISOString(),
      setupComplete: false
    }
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2))
    console.log('✅ Created firebase-config-summary.json')

    console.log('')
    console.log('🎉 Firebase configuration complete!')
    console.log('')
    console.log('Next steps:')
    console.log('1. Start the development server: bun dev')
    console.log('2. Test authentication locally')
    console.log('3. For production deployment:')
    console.log('   - Run: ./scripts/deploy-netlify.sh')
    console.log('   - Or manually set environment variables in Netlify dashboard')
    console.log('4. Visit /admin/setup to initialize the database')
    console.log('')
    console.log('📚 See FIREBASE_PROJECT_SETUP.md for detailed instructions')

  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    process.exit(1)
  } finally {
    rl.close()
  }
}

if (require.main === module) {
  main()
}

module.exports = {
  validateFirebaseConfig,
  generateEnvFile,
  generateNetlifyDeployment
}