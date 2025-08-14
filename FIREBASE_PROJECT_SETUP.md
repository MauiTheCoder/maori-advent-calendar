# Firebase Project Configuration Guide
### Mahuru Activation 2025 Platform

This guide will walk you through configuring a production Firebase project for the Mahuru Activation platform.

## Phase 1: Create Firebase Project

### Step 1: Access Firebase Console
1. Go to [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Sign in with your Google account (use Te Wānanga o Aotearoa account if available)

### Step 2: Create New Project
1. Click **"Add project"** or **"Create a project"**
2. Enter project details:
   - **Project name**: `Mahuru Activation 2025`
   - **Project ID**: `mahuru-activation-2025` (or similar, must be globally unique)
   - **Location**: Australia or New Zealand region for optimal performance

3. **Google Analytics**: Enable for analytics and user insights
   - Select "Create a new account" for Google Analytics
   - Choose New Zealand or Australia as the analytics location

4. Click **"Create project"**
5. Wait for provisioning (usually 30-60 seconds)

## Phase 2: Configure Authentication

### Step 1: Enable Authentication
1. In your Firebase project, click **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab

### Step 2: Configure Sign-in Methods
1. **Email/Password**:
   - Click on "Email/Password"
   - Toggle **"Enable"**
   - Toggle **"Email link (passwordless sign-in)"** if desired
   - Click **"Save"**

2. **Google Sign-in** (Optional but recommended):
   - Click on "Google"
   - Toggle **"Enable"**
   - Add your domain: `maori-advent-calendar.netlify.app`
   - Set support email
   - Click **"Save"**

### Step 3: Configure Settings
1. Go to **"Settings"** tab in Authentication
2. **Authorized domains**:
   - Add: `maori-advent-calendar.netlify.app`
   - Add: `localhost` (for development)
   - Add any custom domains you plan to use

## Phase 3: Create Firestore Database

### Step 1: Initialize Firestore
1. Click **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. **Security rules**: Choose **"Start in test mode"** (we'll secure later)
4. **Location**: Choose `australia-southeast1` or `asia-southeast1` for New Zealand users
5. Click **"Done"**

### Step 2: Configure Security Rules
1. Go to **"Rules"** tab in Firestore Database
2. Replace the default rules with this secure configuration:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user is admin
    function isAdmin() {
      return isAuthenticated() && 
        exists(/databases/$(database)/documents/admin_users/$(request.auth.uid));
    }
    
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if isAuthenticated() && request.auth.uid == userId;
    }
    
    // Anyone can read characters and activities (public content)
    match /characters/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    match /activities/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // User progress - users can only access their own data
    match /user_progress/{progressId} {
      allow read, write: if isAuthenticated() && 
        resource.data.user_id == request.auth.uid;
      allow create: if isAuthenticated() && 
        request.resource.data.user_id == request.auth.uid;
    }
    
    // Admin user management
    match /admin_users/{userId} {
      allow read: if isAuthenticated() && request.auth.uid == userId;
      allow write: if isAuthenticated() && request.auth.uid == userId;
      allow create: if isAuthenticated() && request.auth.uid == userId;
    }
    
    // CMS Content - public read, admin write
    match /cms_content/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    match /layout_settings/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    match /global_settings/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    match /media_assets/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

3. Click **"Publish"**

## Phase 4: Get Configuration Values

### Step 1: Get Web App Configuration
1. Go to **Project Settings** (gear icon in left sidebar)
2. Scroll to **"Your apps"** section
3. Click the **web icon** (`</>`) to add a web app
4. **App details**:
   - App nickname: `Mahuru Web App`
   - Check **"Also set up Firebase Hosting"** (optional)
5. Click **"Register app"**

### Step 2: Copy Configuration
Copy the Firebase configuration object that appears:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "mahuru-activation-2025.firebaseapp.com",
  projectId: "mahuru-activation-2025",
  storageBucket: "mahuru-activation-2025.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

## Phase 5: Configure Environment Variables

### Step 1: Create Production Environment File
1. Create `.env.local` in your project root
2. Add the Firebase configuration:

```env
# Firebase Configuration (Production)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mahuru-activation-2025.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mahuru-activation-2025
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mahuru-activation-2025.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAILS=admin@tewananga.ac.nz,your-email@example.com

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://maori-advent-calendar.netlify.app
NEXT_PUBLIC_ENVIRONMENT=production
```

### Step 2: Configure Netlify Environment Variables
1. Go to your Netlify dashboard
2. Select your site: `maori-advent-calendar`
3. Go to **Site settings** → **Environment variables**
4. Add each environment variable:

| Variable Name | Value |
|---------------|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Your API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Your auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Your project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Your storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Your messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Your app ID |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Your measurement ID |
| `NEXT_PUBLIC_ADMIN_EMAILS` | Comma-separated admin emails |
| `NEXT_PUBLIC_SITE_URL` | `https://maori-advent-calendar.netlify.app` |
| `NEXT_PUBLIC_ENVIRONMENT` | `production` |

## Phase 6: Test the Configuration

### Step 1: Local Testing
1. Run the application locally:
   ```bash
   bun dev
   ```
2. Check browser console for Firebase initialization messages
3. Test user registration and login
4. Visit `/admin/setup` to create first admin user

### Step 2: Production Testing
1. Deploy to Netlify (should auto-deploy from Git)
2. Wait for deployment to complete
3. Visit your production URL
4. Test the same functionality as local

### Step 3: Admin Setup
1. Go to `https://maori-advent-calendar.netlify.app/admin/setup`
2. Initialize the database system
3. Create your admin account using one of the configured admin emails
4. Verify admin dashboard access

## Phase 7: Security Hardening

### Step 1: API Key Restrictions
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to **APIs & Services** → **Credentials**
4. Find your **Browser key (auto created by Firebase)**
5. Click **Edit**
6. Under **Application restrictions**:
   - Select **HTTP referrers (web sites)**
   - Add: `https://maori-advent-calendar.netlify.app/*`
   - Add: `http://localhost:3000/*` (for development)

### Step 2: Enable App Check (Recommended)
1. In Firebase Console, go to **App Check**
2. Click **Get started**
3. For **Web apps**, choose **reCAPTCHA v3**
4. Add your domain: `maori-advent-calendar.netlify.app`
5. Click **Save**

### Step 3: Monitor Usage
1. Set up **Budget alerts** in Google Cloud Console
2. Monitor **Firestore usage** in Firebase Console
3. Set up **Error reporting** for production issues

## Troubleshooting

### Common Issues
1. **"Firebase configuration not found"**
   - Verify all environment variables are set in Netlify
   - Check for typos in variable names
   - Ensure values don't have trailing spaces

2. **"Permission denied" errors**
   - Verify Firestore rules are published
   - Check if user is authenticated
   - Ensure admin user exists in admin_users collection

3. **"Domain not authorized"**
   - Add domain to authorized domains in Authentication settings
   - Update API key restrictions in Google Cloud Console

### Debug Steps
1. Check browser console for error messages
2. Verify network requests in browser DevTools
3. Check Firestore logs in Firebase Console
4. Test authentication flow step by step

## Support Resources
- [Firebase Documentation](https://firebase.google.com/docs)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

## Next Steps After Setup
1. Create content in the CMS
2. Customize layout and design
3. Add Te Reo Māori content
4. Test with real users
5. Monitor performance and usage