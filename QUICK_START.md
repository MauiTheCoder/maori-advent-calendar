# Quick Start Guide
## Mahuru Activation 2025 - Firebase Setup

This guide will get you up and running with Firebase in under 15 minutes.

## Prerequisites

- Node.js 18+ installed
- A Google account
- Git repository cloned locally

## Step 1: Create Firebase Project (5 minutes)

1. **Go to [Firebase Console](https://console.firebase.google.com/)**
2. **Click "Add project"**
3. **Enter project details:**
   - Name: `Mahuru Activation 2025`
   - Project ID: `mahuru-activation-2025` (must be unique)
   - Location: Australia/New Zealand region
4. **Enable Google Analytics** (recommended)
5. **Click "Create project"**

## Step 2: Configure Authentication (2 minutes)

1. **In Firebase Console, go to "Authentication"**
2. **Click "Get started"**
3. **Enable "Email/Password" sign-in method**
4. **Add authorized domain:** `maori-advent-calendar.netlify.app`

## Step 3: Create Firestore Database (2 minutes)

1. **Go to "Firestore Database"**
2. **Click "Create database"**
3. **Choose "Start in test mode"**
4. **Select region:** `australia-southeast1`
5. **Click "Done"**

## Step 4: Get Web App Configuration (1 minute)

1. **Go to Project Settings (gear icon)**
2. **Click web icon (`</>`) to add web app**
3. **App nickname:** `Mahuru Web App`
4. **Copy the firebaseConfig object**

## Step 5: Configure Environment Variables (3 minutes)

### Option A: Interactive Setup (Recommended)
```bash
# Run the interactive setup script
bun run firebase:setup
```

### Option B: Manual Setup
1. **Copy `.env.local.example` to `.env.local`**
2. **Fill in your Firebase values:**

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mahuru-activation-2025.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mahuru-activation-2025
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mahuru-activation-2025.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

NEXT_PUBLIC_ADMIN_EMAILS=your-email@example.com
NEXT_PUBLIC_SITE_URL=https://maori-advent-calendar.netlify.app
NEXT_PUBLIC_ENVIRONMENT=development
```

## Step 6: Test Configuration (2 minutes)

```bash
# Validate your configuration
bun run firebase:validate

# Start the development server
bun dev
```

**Visit:** `http://localhost:3000`

## Step 7: Create Admin User (1 minute)

1. **Visit:** `http://localhost:3000/admin/setup`
2. **Click "Initialize Database"**
3. **Create admin account** (use email from `NEXT_PUBLIC_ADMIN_EMAILS`)
4. **Access admin dashboard**

## Production Deployment

### For Netlify:
1. **Set environment variables** in Netlify dashboard
2. **Deploy:** `git push origin main`
3. **Visit:** `https://maori-advent-calendar.netlify.app/admin/setup`

### Environment Variables for Netlify:
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
NEXT_PUBLIC_ADMIN_EMAILS
NEXT_PUBLIC_SITE_URL=https://maori-advent-calendar.netlify.app
NEXT_PUBLIC_ENVIRONMENT=production
```

## Useful Commands

```bash
# Setup Firebase configuration
bun run firebase:setup

# Validate current configuration
bun run firebase:validate

# Quick validation check
bun run firebase:check

# Complete setup (interactive + validation)
bun run setup

# Development server
bun dev

# Build for production
bun build

# Type checking and linting
bun run lint
```

## Troubleshooting

### ❌ "Firebase configuration not found"
- Ensure `.env.local` exists in project root
- Check all required variables are set
- Run `bun run firebase:validate`

### ❌ "Permission denied" in Firestore
- Visit `/admin/setup` to initialize database
- Ensure Firestore rules are published
- Check user authentication status

### ❌ "Domain not authorized"
- Add domain to Authentication > Settings > Authorized domains
- For local development, ensure `localhost` is authorized

### ❌ Build failures
- Run `bun run lint` to check for TypeScript errors
- Ensure all environment variables are set in Netlify
- Check Netlify deploy logs for specific errors

## Next Steps

1. **Customize content** in `/admin/content`
2. **Adjust layout** in `/admin/layout`
3. **Add Te Reo Māori activities**
4. **Test with real users**
5. **Monitor Firebase usage**

## Support

- **Detailed Guide:** See `FIREBASE_PROJECT_SETUP.md`
- **Firebase Docs:** [firebase.google.com/docs](https://firebase.google.com/docs)
- **Issues:** Check browser console and Netlify deploy logs

---

**🌿 Kia ora! Welcome to Mahuru Activation 2025**