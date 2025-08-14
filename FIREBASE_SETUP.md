# Firebase Setup Guide

This guide will walk you through setting up Firebase for the Mahuru Activation 2025 platform.

## Prerequisites

- A Google account
- Node.js and npm/bun installed
- Access to the Firebase Console

## Step 1: Create Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `maori-advent-calendar` (or your preferred name)
4. Enable Google Analytics (optional but recommended)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication
5. (Optional) Enable "Google" sign-in for easier access

## Step 3: Create Firestore Database

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (we'll secure it later)
4. Select a location close to your users (e.g., australia-southeast1)
5. Click "Done"

## Step 4: Configure Firebase Rules

In the Firestore Database section, go to "Rules" and replace with the content from `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone can read characters and activities
    match /characters/{document=**} {
      allow read: if true;
    }
    
    match /activities/{document=**} {
      allow read: if true;
    }
    
    // Only authenticated users can read/write progress
    match /user_progress/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Admin collections - only for admin users
    match /admin_users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /cms_content/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/admin_users/$(request.auth.uid));
    }
    
    match /layout_settings/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/admin_users/$(request.auth.uid));
    }
    
    match /global_settings/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/admin_users/$(request.auth.uid));
    }
    
    match /media_assets/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/admin_users/$(request.auth.uid));
    }
  }
}
```

## Step 5: Get Firebase Configuration

1. Go to Project Settings (gear icon in left sidebar)
2. Scroll down to "Your apps" section
3. Click "Web app" icon (</>) to create a web app
4. Enter app name: `Mahuru Activation 2025`
5. Enable Firebase Hosting (optional)
6. Click "Register app"
7. Copy the Firebase configuration object

## Step 6: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your Firebase configuration in `.env.local`:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

   # Admin Configuration
   NEXT_PUBLIC_ADMIN_EMAILS=your-admin-email@example.com

   # Environment
   NEXT_PUBLIC_ENVIRONMENT=development
   ```

## Step 7: Initialize the Application

1. Install dependencies:
   ```bash
   bun install
   ```

2. Start the development server:
   ```bash
   bun dev
   ```

3. The application will automatically:
   - Validate Firebase configuration
   - Seed the database with initial data
   - Initialize the admin system
   - Create necessary collections

## Step 8: Create First Admin User

1. Go to `/admin/setup` in your browser
2. Sign up with the email address you specified in `NEXT_PUBLIC_ADMIN_EMAILS`
3. The system will automatically grant admin privileges

## Security Considerations

### Environment Variables
- Never commit `.env.local` to version control
- Use different projects for development and production
- Restrict API keys to specific domains in production

### Firestore Rules
- The provided rules are secure for the application structure
- Test rules thoroughly before deploying to production
- Monitor Firestore usage to prevent abuse

### Authentication
- Enable email verification in production
- Consider implementing rate limiting
- Monitor authentication logs for suspicious activity

## Production Deployment

### Netlify
1. Set environment variables in Netlify dashboard
2. Enable automatic deployments from your Git repository
3. Update `NEXT_PUBLIC_SITE_URL` to your production URL

### Firebase Security
1. Update Firestore rules for production
2. Enable App Check for additional security
3. Set up monitoring and alerts

## Troubleshooting

### Common Issues

1. **Environment variables not loading**
   - Ensure `.env.local` is in the project root
   - Restart the development server after changes
   - Check for typos in variable names

2. **Firestore permission denied**
   - Verify Firestore rules are correctly set
   - Ensure user is authenticated
   - Check if admin user exists in `admin_users` collection

3. **Firebase initialization errors**
   - Verify all required environment variables are set
   - Check Firebase project settings
   - Ensure API keys are correct and not restricted

### Debug Mode

Enable debug logging by setting:
```env
NEXT_PUBLIC_ENVIRONMENT=development
```

This will show detailed Firebase initialization logs in the browser console.

## Support

For Firebase-specific issues:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Support](https://firebase.google.com/support)

For application-specific issues:
- Check the browser console for errors
- Review the application logs
- Ensure all dependencies are installed