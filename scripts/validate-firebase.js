#!/usr/bin/env node

/**
 * Firebase Configuration Validation Script
 * Validates that Firebase is properly configured and accessible
 */

const fs = require('fs')
const path = require('path')

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
}

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local')
  
  if (!fs.existsSync(envPath)) {
    throw new Error('.env.local file not found. Run setup-firebase.js first.')
  }

  const envContent = fs.readFileSync(envPath, 'utf8')
  const env = {}
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=')
      if (key && valueParts.length > 0) {
        env[key] = valueParts.join('=')
      }
    }
  })

  return env
}

function validateEnvironmentVariables(env) {
  const required = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
    'NEXT_PUBLIC_ADMIN_EMAILS',
    'NEXT_PUBLIC_SITE_URL',
    'NEXT_PUBLIC_ENVIRONMENT'
  ]

  const missing = []
  const invalid = []

  required.forEach(key => {
    if (!env[key]) {
      missing.push(key)
    } else {
      // Basic validation
      const value = env[key]
      
      if (key === 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN' && !value.includes('.firebaseapp.com')) {
        invalid.push(`${key}: should end with .firebaseapp.com`)
      }
      
      if (key === 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET' && !value.includes('.appspot.com')) {
        invalid.push(`${key}: should end with .appspot.com`)
      }
      
      if (key === 'NEXT_PUBLIC_ADMIN_EMAILS' && !value.includes('@')) {
        invalid.push(`${key}: should contain valid email addresses`)
      }
      
      if (key === 'NEXT_PUBLIC_SITE_URL' && !value.startsWith('http')) {
        invalid.push(`${key}: should start with http:// or https://`)
      }
    }
  })

  return { missing, invalid }
}

async function testFirebaseConnection(env) {
  // This would require running in a Next.js environment
  // For now, we'll just validate the configuration format
  
  const config = {
    apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
  }

  // Validate project ID format
  if (!/^[a-z0-9-]+$/.test(config.projectId)) {
    throw new Error('Project ID contains invalid characters')
  }

  // Validate API key format (should be a long string)
  if (config.apiKey.length < 30) {
    throw new Error('API key appears to be too short')
  }

  // Validate App ID format
  if (!config.appId.includes(':') || !config.appId.includes('web')) {
    throw new Error('App ID format appears incorrect')
  }

  return config
}

function checkPackageJson() {
  const packagePath = path.join(process.cwd(), 'package.json')
  
  if (!fs.existsSync(packagePath)) {
    throw new Error('package.json not found')
  }

  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
  const firebaseDeps = ['firebase']
  const nextDeps = ['next', 'react', 'react-dom']
  
  const missing = []
  
  firebaseDeps.forEach(dep => {
    if (!pkg.dependencies?.[dep] && !pkg.devDependencies?.[dep]) {
      missing.push(dep)
    }
  })
  
  nextDeps.forEach(dep => {
    if (!pkg.dependencies?.[dep] && !pkg.devDependencies?.[dep]) {
      missing.push(dep)
    }
  })

  return { missing, hasFirebase: missing.length === 0 }
}

function generateHealthCheck(env) {
  const healthCheck = `// Firebase Health Check
// This file can be used to test Firebase configuration in your app

import { validateFirebaseConfig } from '../src/lib/env-validation'

export function checkFirebaseHealth() {
  try {
    const config = validateFirebaseConfig()
    console.log('✅ Firebase configuration is valid')
    console.log('Project ID:', config.projectId)
    console.log('Environment:', process.env.NEXT_PUBLIC_ENVIRONMENT)
    return true
  } catch (error) {
    console.error('❌ Firebase configuration error:', error.message)
    return false
  }
}

// Run health check if this file is executed directly
if (typeof window !== 'undefined') {
  checkFirebaseHealth()
}
`

  const healthPath = path.join(process.cwd(), 'scripts', 'health-check.js')
  fs.writeFileSync(healthPath, healthCheck)
  
  return healthPath
}

async function main() {
  console.log('🔍 Mahuru Activation 2025 - Firebase Validation')
  console.log('===============================================')
  console.log('')

  let hasErrors = false

  try {
    // Check 1: Environment file exists and is readable
    log('blue', '1. Checking environment file...')
    const env = loadEnvFile()
    log('green', '   ✅ .env.local found and readable')

    // Check 2: Required environment variables
    log('blue', '2. Validating environment variables...')
    const { missing, invalid } = validateEnvironmentVariables(env)
    
    if (missing.length > 0) {
      log('red', '   ❌ Missing required variables:')
      missing.forEach(key => log('red', `      - ${key}`))
      hasErrors = true
    }
    
    if (invalid.length > 0) {
      log('red', '   ❌ Invalid variable values:')
      invalid.forEach(error => log('red', `      - ${error}`))
      hasErrors = true
    }
    
    if (missing.length === 0 && invalid.length === 0) {
      log('green', '   ✅ All required variables present and valid')
    }

    // Check 3: Firebase configuration format
    log('blue', '3. Validating Firebase configuration...')
    try {
      const config = await testFirebaseConnection(env)
      log('green', '   ✅ Firebase configuration format is valid')
      log('green', `   Project: ${config.projectId}`)
      log('green', `   Environment: ${env.NEXT_PUBLIC_ENVIRONMENT}`)
    } catch (error) {
      log('red', `   ❌ Firebase configuration error: ${error.message}`)
      hasErrors = true
    }

    // Check 4: Dependencies
    log('blue', '4. Checking dependencies...')
    try {
      const { missing: missingDeps, hasFirebase } = checkPackageJson()
      
      if (missingDeps.length > 0) {
        log('red', '   ❌ Missing dependencies:')
        missingDeps.forEach(dep => log('red', `      - ${dep}`))
        log('yellow', '   Run: bun install')
        hasErrors = true
      } else {
        log('green', '   ✅ All required dependencies installed')
      }
    } catch (error) {
      log('red', `   ❌ Package.json check failed: ${error.message}`)
      hasErrors = true
    }

    // Check 5: Project structure
    log('blue', '5. Checking project structure...')
    const requiredFiles = [
      'src/lib/firebase.ts',
      'src/lib/env-validation.ts',
      'src/hooks/useAuth.ts',
      'src/contexts/AuthContext.tsx'
    ]

    const missingFiles = requiredFiles.filter(file => 
      !fs.existsSync(path.join(process.cwd(), file))
    )

    if (missingFiles.length > 0) {
      log('red', '   ❌ Missing required files:')
      missingFiles.forEach(file => log('red', `      - ${file}`))
      hasErrors = true
    } else {
      log('green', '   ✅ All required files present')
    }

    // Generate health check file
    log('blue', '6. Generating health check...')
    const healthPath = generateHealthCheck(env)
    log('green', `   ✅ Health check created: ${path.relative(process.cwd(), healthPath)}`)

    console.log('')
    
    if (hasErrors) {
      log('red', '❌ Validation failed with errors')
      log('yellow', 'Please fix the issues above and run validation again')
      process.exit(1)
    } else {
      log('green', '🎉 All validations passed!')
      console.log('')
      log('blue', 'Next steps:')
      console.log('   1. Start development server: bun dev')
      console.log('   2. Visit http://localhost:3000')
      console.log('   3. Check browser console for Firebase initialization')
      console.log('   4. Test authentication at /admin/setup')
      console.log('')
      log('blue', 'For production deployment:')
      console.log('   1. Set environment variables in Netlify')
      console.log('   2. Deploy with: git push origin main')
      console.log('   3. Visit your production URL')
    }

  } catch (error) {
    log('red', `❌ Validation failed: ${error.message}`)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

module.exports = {
  loadEnvFile,
  validateEnvironmentVariables,
  testFirebaseConnection,
  checkPackageJson
}